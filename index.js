(function () {
  const checkData = async (url, fileName, items) => {
    let res = null;
    try {
      res = await fetch(`${url}/${fileName}`);
    } catch (err) {
      console.log(err);
    }

    if (!res) {
      return;
    }

    if (res.status === 200) {
      res = await res.text();
      try {
        res = JSON.parse(res);
        if (res.length > 0) {
          for (let i = 0; i < res.length; i++) {
            await checkData(url, res[i], items);
          }
        }
      } catch (err) {
        if (res) {
          items.push(res);
        }
      }
    }
  };

  const getAwaitText = async (url) => {
    const items = [];
    const text = document.querySelector('textarea');
    const button = document.querySelector('button');

    //Loading block
    button.disabled = true;
    text.textContent = 'Wait...';

    await checkData(url, 'root.txt', items);

    if (items.length) {
      text.textContent = items.join(' ');
    }

    button.disabled = false;
  };

  function checkPromiseData(url, fileName, items, num) {
    try {
      fetch(`${url}/${fileName}`)
        .then(function (res) {
          return res.text();
        })
        .then(function (data) {
          try {
            data = JSON.parse(data);
            if (data.length > 0) {
              if (num) {
                num *= 10;
              }
              for (let i = 0; i < data.length; i++) {
                checkPromiseData(url, data[i], items, ++num);
              }
            }
          } catch (err) {
            if (data) {
              //Add word
              items.push(
                new Promise(function (resolve) {
                  resolve({ data, num: num.toString() });
                })
              );
            }
          }
        });
    } catch (err) {
      console.log(err);
    }
  }

  function compare(a, b) {
    if (a.num < b.num) {
      return -1;
    }
    if (a.num > b.num) {
      return 1;
    }
    return 0;
  }

  function getPromiseText(url) {
    const items = [];
    const textarea = document.querySelector('textarea');

    textarea.textContent = 'Wait...';

    checkPromiseData(url, 'root.txt', items, 0);

    setTimeout(function () {
      Promise.all(items).then(function (values) {
        let sorted = values.sort(compare);
        sorted = sorted.map(function (item) {
          return item.data;
        });

        textarea.textContent = sorted.join(' ');
      });
    }, 500);
  }

  const getData = (e) => {
    e.preventDefault();
    const select = document.querySelector('select');
    const method = select.options[select.selectedIndex].text;
    const url = 'https://fe.it-academy.by/Examples/words_tree';

    if (method === 'Promise') {
      getPromiseText(url);
    } else {
      getAwaitText(url);
    }
  };

  const checkButton = (e) => {
    if (document.readyState === 'complete') {
      document.querySelector('button').addEventListener('click', getData);
    }
  };

  document.addEventListener('readystatechange', checkButton);
})();
