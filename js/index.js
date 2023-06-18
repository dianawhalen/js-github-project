document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('github-form');
  const userList = document.getElementById('user-list');
  const repoList = document.getElementById('repos-list');

  const searchTypeButton = document.createElement('button');
  searchTypeButton.textContent = 'Switch to repository search';
  form.appendChild(searchTypeButton);

  let searchType = 'users';

  searchTypeButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (searchType === 'users') {
      searchType = 'repositories';
      searchTypeButton.textContent = 'Switch to user search';
    } else {
      searchType = 'users';
      searchTypeButton.textContent = 'Switch to repository search';
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const searchValue = document.getElementById('search').value;

    let url = `https://api.github.com/search/${searchType}?q=${searchValue}`;

    fetch(url, {
      headers: {
        "Accept": "application/vnd.github.v3+json"
      }
    })
    .then(res => res.json())
    .then(data => {
      userList.innerHTML = '';
      repoList.innerHTML = '';

      if (searchType === 'users') {
        data.items.forEach(user => {
          const userLi = document.createElement('li');
          userLi.innerHTML = `
            <img src="${user.avatar_url}" width="50">
            <a href="${user.html_url}" target="_blank">${user.login}</a>
            <button data-username="${user.login}">View Repositories</button>
          `;
          userList.appendChild(userLi);
        });
      } else {
        data.items.forEach(repo => {
          const repoLi = document.createElement('li');
          repoLi.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          `;
          repoList.appendChild(repoLi);
        });
      }
    })
    .catch(error => console.error(error));
  });

  userList.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
      const username = e.target.dataset.username;

      fetch(`https://api.github.com/users/${username}/repos`, {
        headers: {
          "Accept": "application/vnd.github.v3+json"
        }
      })
      .then(res => res.json())
      .then(data => {
        repoList.innerHTML = '';
        data.forEach(repo => {
          const repoLi = document.createElement('li');
          repoLi.innerHTML = `
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          `;
          repoList.appendChild(repoLi);
        });
      })
      .catch(error => console.error(error));
    }
  });
});
