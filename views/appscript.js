document.addEventListener('DOMContentLoaded', async () => {
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
    let isMenuBarVisible = true;

    function toggleMenuBar() {
        if (window.scrollY <= 50) {
            if (isMenuBarVisible) {
                menuBar.style.top = '-100px';
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

            window.removeEventListener('scroll', checkScroll);
        }
    }

    window.addEventListener('scroll', checkScroll);

    const audio = new Audio("photo/music/thunder.mp3");
    
    audio.play();



    
    const userId = localStorage.getItem('id');
    const biographyForm = document.querySelector('form');
    const commentList = document.querySelector('.comment-list');

    // Fetch user data
    const response = await fetch('/' + userId);
    const userData = await response.json();
    const name = userData.name;
    const img = userData.img;
    const email = userData.email; 

    biographyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const biography = document.getElementById('biography').value;

        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ biography, userId, name, img, email })
            });

            if (response.status === 200) {
                const result = await response.json();
                console.log(result.message);
                biographyForm.reset();
                commentList.innerHTML = '';
                loadComments(); 
            } else {
                console.log('Error:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    });

    async function loadComments() {
        try {
            const commentsResponse = await fetch('/comments');
            if (commentsResponse.ok) {
                const commentsData = await commentsResponse.json();
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
    }

    loadComments();
});
