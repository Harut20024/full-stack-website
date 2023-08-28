// Smooth scrolling for menu links
document.querySelectorAll('.menu-list a').forEach(link => {
    link.addEventListener('click', smoothScroll);
});

function smoothScroll(event) {
    event.preventDefault();

    const target = document.querySelector(this.getAttribute('href'));
    const targetTop = target.offsetTop;

    window.scrollTo({
        top: targetTop,
        behavior: 'smooth'
    });
}



const menuBar = document.querySelector('.menu-bar');
let isMenuBarVisible = true; // Initialize as true so that the menu bar is visible initially

function toggleMenuBar() {
    if (window.scrollY <= 50) {
        if (isMenuBarVisible) {
            menuBar.style.top = '-100px'; // Adjust the value based on your menu bar's height
            isMenuBarVisible = false;
        }
    } else {
        if (!isMenuBarVisible) {
            menuBar.style.top = '0';
            isMenuBarVisible = true;
        }
    }
}

window.addEventListener('scroll', toggleMenuBar);

const animateElements = document.querySelectorAll('.cv-content');
const triggerElement = document.querySelector('.animate-trigger');

function checkScroll() {
    const triggerPosition = triggerElement.getBoundingClientRect().top;
    const windowHeight = window.innerHeight;

    if (triggerPosition < windowHeight) {
        animateElements.forEach(element => {
            element.classList.add('animate');
        });

        // Remove the scroll event listener after the animation is triggered
        window.removeEventListener('scroll', checkScroll);
    }
}

window.addEventListener('scroll', checkScroll);




document.addEventListener('DOMContentLoaded', async () => {
    const audio = new Audio("photo/music/thunder.mp3");
    audio.play();

    const userId = localStorage.getItem('id');
    const biographyForm = document.querySelector('form');

    biographyForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const response = await fetch('/' + userId);
        const userData = await response.json();
        const biography = document.getElementById('biography').value;
        const name = userData.name
        const img = userData.img
        const email = userData.email
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ biography, userId, name, img, email })
            });

            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
                window.location.href = '/';

            } else {
                console.log('Error:', response.statusText);
                // Handle the error response if needed
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });
    

    try {
        const commentsResponse = await fetch('/comments');
        if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            const commentList = document.querySelector('.comment-list');
            
            commentsData.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.classList.add('user-info');
                commentItem.innerHTML = `
                    <img id="user-img" src="/uploads/${comment.img}" alt="User Image">
                    <p>Name: <span class="user-name">${comment.name}</span></p>
                    <p>Comment: <span class="user-comment">${comment.comment}</span></p>
                `;
                commentList.appendChild(commentItem);
            });
        } else {
            console.log('Failed to fetch comments:', commentsResponse.statusText);
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }

});



