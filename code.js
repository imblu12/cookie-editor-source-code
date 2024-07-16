document.addEventListener('DOMContentLoaded', function () {
  const cookieList = document.getElementById('cookie-list');
  const createCookieButton = document.getElementById('create-cookie-button');
  const newCookieName = document.getElementById('new-cookie-name');
  const newCookieValue = document.getElementById('new-cookie-value');

  function fetchCookies() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = new URL(tabs[0].url);
      chrome.cookies.getAll({ url: url.href }, function (cookies) {
        cookieList.innerHTML = '';
        cookies.forEach(cookie => {
          const cookieItem = document.createElement('div');
          cookieItem.className = 'cookie-item';

          const nameContainer = document.createElement('div');
          nameContainer.className = 'cookie-name-container';

          const arrowIcon = document.createElement('span');
          arrowIcon.className = 'arrow-icon';

          const nameSpan = document.createElement('span');
          nameSpan.textContent = cookie.name;
          nameSpan.className = 'cookie-name';

          nameContainer.appendChild(arrowIcon);
          nameContainer.appendChild(nameSpan);

          cookieItem.appendChild(nameContainer);

          const valueInput = document.createElement('input');
          valueInput.value = cookie.value;
          valueInput.className = 'hidden';

          const updateButton = document.createElement('button');
          updateButton.textContent = 'Update';
          updateButton.className = 'hidden';
          updateButton.addEventListener('click', function (event) {
            event.stopPropagation();

            const updatedCookie = {
              url: url.href,
              name: cookie.name,
              value: valueInput.value,
              domain: cookie.domain,
              path: cookie.path,
              secure: cookie.secure,
              httpOnly: cookie.httpOnly,
              sameSite: cookie.sameSite,
              expirationDate: cookie.expirationDate
            };
            chrome.cookies.set(updatedCookie, fetchCookies);
          });

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.className = 'hidden';
          deleteButton.addEventListener('click', function (event) {
            event.stopPropagation();

            chrome.cookies.remove({ url: url.href, name: cookie.name }, fetchCookies);
          });

          const copyButton = document.createElement('button');
          copyButton.textContent = 'Copy';
          copyButton.className = 'hidden';
          copyButton.addEventListener('click', function (event) {
            event.stopPropagation();

            navigator.clipboard.writeText(cookie.value);
            copyButton.style.backgroundColor = '#606060';
            setTimeout(() => {
              copyButton.style.backgroundColor = '';
            }, 200);
          });

          cookieItem.appendChild(valueInput);
          cookieItem.appendChild(updateButton);
          cookieItem.appendChild(copyButton);
          cookieItem.appendChild(deleteButton);

          cookieList.appendChild(cookieItem);


          nameContainer.addEventListener('click', function () {
            toggleActions(cookieItem);
          });
        });
      });
    });
  }

  function toggleActions(cookieItem) {

    const inputFields = cookieItem.querySelectorAll('input, button');
    inputFields.forEach(field => field.classList.toggle('hidden'));
    cookieItem.classList.toggle('open');
    const arrowIcon = cookieItem.querySelector('.arrow-icon');
    arrowIcon.classList.toggle('open');
  }

  createCookieButton.addEventListener('click', function () {
    const name = newCookieName.value.trim();
    const value = newCookieValue.value.trim();

    if (name && value) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const url = new URL(tabs[0].url);
        const newCookie = {
          url: url.href,
          name: name,
          value: value
        };
        chrome.cookies.set(newCookie, function () {
          newCookieName.value = '';
          newCookieValue.value = '';
          fetchCookies();
        });
      });
    }
  });

  fetchCookies();
});
