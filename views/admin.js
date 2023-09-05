const commentList = document.querySelector('.comment-list');

async function loadComments() {
    try {
        // Fetch comments from the server
        const commentsResponse = await fetch('/comments');
        if (commentsResponse.ok) {
            const commentsData = await commentsResponse.json();
            commentsData.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.classList.add('user-info');
                commentItem.dataset.commentId = comment.id; // Add a data attribute to uniquely identify each comment
                commentItem.innerHTML = `
                    <img id="user-img" src="/uploads/${comment.img}" alt="User Image">
                    <p>Name: <span class="user-name">${comment.name}</span></p>
                    <p>Comment: <span class="user-comment">${comment.comment}</span></p>
                    <button onclick="deleteComment('${comment.id}')">Delete</button>
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

function deleteComment(commentId) {
    fetch(`admin/event/${commentId}`, {
      method: 'DELETE'
    })
      .then((resp) => {
        if (resp.ok) {
          // Remove the deleted comment from the UI
          const commentItem = document.querySelector(`[data-comment-id="${commentId}"]`);
          if (commentItem) {
            commentItem.remove();
          }
        } else {
          console.log('Failed to delete comment:', resp.statusText);
        }
      })
      .catch((err) => console.log(err));
  }

loadComments();
