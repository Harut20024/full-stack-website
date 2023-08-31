import express from "express";
import session from "express-session";
import path from "path";
import bcrypt from "bcrypt";
import passport from "passport";
import passportLocal from "passport-local";
import multer from "multer"; // Add Multer for image uploads
import { promises as fsPromises } from "fs";

const app = express();

app.use('/uploads', express.static('uploads'));
app.use(express.static("views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false
}));

const upload = multer({ dest: 'uploads/' }); // Change 'uploads/' to your desired upload directory
app.use(passport.initialize());
app.use(passport.session());

passport.use(new passportLocal.Strategy({
  usernameField: "email"
}, async (email, password, done) => {
  try {
    const data = await fsPromises.readFile("data.json");
    const users = JSON.parse(data);

    const user = users.find((user) => user.email === email);

    if (!user) {
      return done(null, false, { message: "Incorrect email" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return done(null, user);
    }

    return done(null, false, { message: "Incorrect password" });
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const data = await fsPromises.readFile("data.json");
    const users = JSON.parse(data);

    const user = users.find((user) => user.id === id);

    if (!user) {
      return done(new Error("User not found"), null);
    }

    done(null, user);
  } catch (error) {
    return done(error);
  }
});

app.get("/register", checkNotAuthentication, (req, res) => {

  res.sendFile(path.resolve("views/register.html"));
});


app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPwd = await bcrypt.hash(password, 10);
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const time = now.toLocaleTimeString();

  const newUser = {
    id: `${Date.now()}_${Math.random()}`,
    data: `${year}-${month}-${day} ${time}`,
    name,
    email,
    password: hashedPwd
  };

  try {
    const data = await fsPromises.readFile("data.json");
    const users = JSON.parse(data);
    users.push(newUser);

    await fsPromises.writeFile("data.json", JSON.stringify(users, null, 2));
    const userId = newUser.id;
    return res.json(userId);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.get("/descrip",checkNotAuthentication, (req, res) => {
  res.sendFile(path.resolve("views/description.html"));
});

app.post("/descrip", upload.single('img'), async (req, res) => {
  try {
    const { img, biography, userId } = req.body;

    const data = await fsPromises.readFile("data.json");
    let users;

    try {
      users = JSON.parse(data);
    } catch (jsonError) {
      throw new Error(`Error parsing JSON: ${jsonError.message}`);
    }

    const userIndex = users.findIndex((u) => u.id === userId);

    if (userIndex === -1) {
      return res.status(400).json({ error: "User not found" });
    }

    users[userIndex].biography = biography;
    users[userIndex].img = req.file.filename; // Store the filename of the uploaded image

    try {
      await fsPromises.writeFile("data.json", JSON.stringify(users, null, 2));
    } catch (writeError) {
      throw new Error(`Error writing file: ${writeError.message}`);
    }

    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.get("/login", checkNotAuthentication, (req, res) => {
  res.sendFile(path.resolve("views/login.html"));
});


app.post("/login", passport.authenticate("local"), async (req, res) => {
  const userId = req.user.id; // Get the user ID from Passport session

  res.json({ userId }); // Respond with the user ID
});





app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/login");
});



app.use(checkAuthentication);

app.get("/comments", async (req, res) => {
  try {
    const data = await fsPromises.readFile("coment.json");
    const comments = JSON.parse(data);

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/", checkAuthentication, async (req, res) => {
  const { biography, userId, name, img, email } = req.body;
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
  const day = now.getDate().toString().padStart(2, '0');
  const time = now.toLocaleTimeString();


  const newComment = {
    img,
    data: `${year}-${month}-${day} ${time}`,
    comment: biography,
    id: userId,
    name,
    email
  };

  try {
    const data = await fsPromises.readFile("coment.json", "utf-8");
    const users = JSON.parse(data);
    users.push(newComment);

    await fsPromises.writeFile("coment.json", JSON.stringify(users, null, 2));

    return res.json({ message: "Comment saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.get('/favicon.ico', (req, res) => {
  res.status(204); // No content
});


app.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const data = await fsPromises.readFile("data.json");
    const users = JSON.parse(data);

    const user = users.find((user) => user.id === userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.get("/", (req, res) => {
  res.sendFile(path.resolve("views/app.html"));
});








function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

function checkNotAuthentication(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
