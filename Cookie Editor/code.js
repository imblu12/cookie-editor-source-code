document.addEventListener('DOMContentLoaded', function () {
  const cookieList = document.getElementById('cookie-list');

  function fetchCookies() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const url = new URL(tabs[0].url);
      chrome.cookies.getAll({ url: url.href }, function (cookies) {
        cookieList.innerHTML = '';
        cookies.forEach(cookie => {
          const cookieItem = document.createElement('div');
          cookieItem.className = 'cookie-item';

          const nameInput = document.createElement('input');
          nameInput.value = cookie.name;
          nameInput.disabled = true;

          const valueInput = document.createElement('input');
          valueInput.value = cookie.value;

          const updateButton = document.createElement('button');
          updateButton.textContent = 'Update';
          updateButton.addEventListener('click', function () {
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

          const copyButton = document.createElement('button');
          copyButton.textContent = 'Copy';
          copyButton.addEventListener('click', function () {
            navigator.clipboard.writeText(cookie.value).then(function () {
              console.log('Cookie value copied to clipboard');
            }, function (err) {
              console.error('Could not copy text: ', err);
            });
          });

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.addEventListener('click', function () {
            chrome.cookies.remove({ url: url.href, name: cookie.name }, fetchCookies);
          });

          cookieItem.appendChild(nameInput);
          cookieItem.appendChild(valueInput);
          cookieItem.appendChild(updateButton);
          cookieItem.appendChild(copyButton);
          cookieItem.appendChild(deleteButton);

          cookieList.appendChild(cookieItem);
        });
      });
    });
  }

  fetchCookies();
});
