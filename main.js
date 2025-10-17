let title = document.getElementById('title');
let price = document.getElementById('price');
let taxes = document.getElementById('taxes');
let ads = document.getElementById('ads');
let discount = document.getElementById('discount');
let total = document.getElementById('total');
let count = document.getElementById('count');
let category = document.getElementById('category');
let submit = document.getElementById('submit');
let mood = 'create';
let tmp;


// حساب التوتال
function getTotal() {
  if (price.value != '') {
    let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
    total.innerHTML = result;
    total.innerHTML = `${result} LE`;
    total.style.background = "#040";
  } else {
    total.innerHTML = '';
    total.style.background = "#a00d02";
  }
}

let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

// إنشاء منتج جديد
submit.onclick = function () {
  let newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerHTML,
    count: count.value,
    category: category.value.toLowerCase(),
  };

  if (title.value && price.value && category.value) {
    if (mood === 'create') {
      if (newPro.count > 1) {
        for (let i = 0; i < newPro.count; i++) {
          dataPro.push(newPro);
        }
      } else {
        dataPro.push(newPro);
      }
    } else {
      dataPro[tmp] = newPro;
      mood = 'create';
      submit.innerHTML = 'Create';
      count.style.display = 'block';
    }

    localStorage.setItem('product', JSON.stringify(dataPro));
    clearData();
    showData();
  }
  window.scroll({
    top: 0,
    behavior: 'smooth'
  });

};

// مسح الحقول
function clearData() {
  title.value = '';
  price.value = '';
  taxes.value = '';
  ads.value = '';
  discount.value = '';
  total.innerHTML = '';
  count.value = '';
  category.value = '';
}

// عرض البيانات
function showData() {
  let table = '';
  getTotal();
  for (let i = 0; i < dataPro.length; i++) {
    table += `
      <tr>
        <td>${i + 1}</td>
        <td>${dataPro[i].title}</td>
        <td>${dataPro[i].price}</td>
        <td>${dataPro[i].taxes}</td>
        <td>${dataPro[i].ads}</td>
        <td>${dataPro[i].discount}</td>
        <td>${dataPro[i].total}</td>
        <td>${dataPro[i].category}</td>
        <td><button onclick="updateData(${i})" id="update">Update</button></td>
        <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
      </tr>`;
  }

  document.getElementById('tbody').innerHTML = table;
  let deleteAllBox = document.getElementById('deleteAll');
  deleteAllBox.innerHTML = dataPro.length > 0
    ? `<button onclick="deleteAll()">Delete All (${dataPro.length})</button>`
    : '';
}
showData();

// حذف منتج
function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.product = JSON.stringify(dataPro);
  showData();
}

// حذف الكل
function deleteAll() {
  localStorage.clear();
  dataPro = [];
  showData();
}

// تحديث منتج
function updateData(i) {
  title.value = dataPro[i].title;
  price.value = dataPro[i].price;
  taxes.value = dataPro[i].taxes;
  ads.value = dataPro[i].ads;
  discount.value = dataPro[i].discount;
  category.value = dataPro[i].category;
  getTotal();
  count.style.display = 'none';
  submit.innerHTML = 'Update';
  mood = 'update';
  tmp = i;
  scroll({ top: 0, behavior: 'smooth' });
}

// البحث
let searchMood = 'title';
function getSearchMood(id) {
  let search = document.getElementById('search');
  if (id === 'searchTitle') searchMood = 'title';
  else searchMood = 'category';
  search.placeholder = 'Search By ' + searchMood;
  search.focus();
  search.value = '';
  showData();
}

function searchData(value) {
  let table = '';
  for (let i = 0; i < dataPro.length; i++) {
    if (searchMood == 'title') {
      if (dataPro[i].title.includes(value.toLowerCase())) {
        table += createRow(i);
      }
    } else {
      if (dataPro[i].category.includes(value.toLowerCase())) {
        table += createRow(i);
      }
    }
  }
  document.getElementById('tbody').innerHTML = table;
}

function createRow(i) {
  return `
    <tr>
      <td>${i + 1}</td>
      <td>${dataPro[i].title}</td>
      <td>${dataPro[i].price}</td>
      <td>${dataPro[i].taxes}</td>
      <td>${dataPro[i].ads}</td>
      <td>${dataPro[i].discount}</td>
      <td>${dataPro[i].total}</td>
      <td>${dataPro[i].category}</td>
      <td><button onclick="updateData(${i})" id="update">Update</button></td>
      <td><button onclick="deleteData(${i})" id="delete">Delete</button></td>
    </tr>`;
}

let btuy = document.querySelector('.btu');

window.onscroll = function () {
  if (scrollY >= 400) {
    btuy.style.display = 'block';
  } else {
    btuy.style.display = 'none';
  }
}
btuy.onclick = function () {
  scroll({
    left: 0,
    top: 0,
    behavior: 'smooth'
  })
}