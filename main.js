// 🔹 تعريف العناصر
let title = document.getElementById('title'),
  price = document.getElementById('price'),
  taxes = document.getElementById('taxes'),
  ads = document.getElementById('ads'),
  discount = document.getElementById('discount'),
  total = document.getElementById('total'),
  count = document.getElementById('count'),
  category = document.getElementById('category'),
  submit = document.getElementById('submit'),
  mood = 'create',
  tmp;

// 🔹 حساب الإجمالي
function getTotal() {
  if (price.value != '') {
    let result = (+price.value + +taxes.value + +ads.value) - +discount.value;
    total.innerHTML = `${result} LE`;
    total.style.background = "#040";
  } else {
    total.innerHTML = '';
    total.style.background = "#a00d02";
  }
}

// 🔹 جلب البيانات من localStorage
let dataPro = localStorage.product ? JSON.parse(localStorage.product) : [];

// 🔹 حساب الإجماليات العامة
function updateTotalAccount() {
  let totalPrice = 0, totalTaxes = 0, totalAds = 0, totalDiscount = 0, totalFinal = 0;

  for (let i = 0; i < dataPro.length; i++) {
    totalPrice += +dataPro[i].price;
    totalTaxes += +dataPro[i].taxes;
    totalAds += +dataPro[i].ads;
    totalDiscount += +dataPro[i].discount;
    let cleanTotal = (dataPro[i].total + '').replace(' LE', '');
    totalFinal += +cleanTotal;
  }

  let totalInputs = document.querySelectorAll('#totalaccount input');
  if (totalInputs.length === 5) {
    totalInputs[0].value = totalPrice ? `${totalPrice} LE` : '0 LE';
    totalInputs[1].value = totalTaxes ? `${totalTaxes} LE` : '0 LE';
    totalInputs[2].value = totalAds ? `${totalAds} LE` : '0 LE';
    totalInputs[3].value = totalDiscount ? `${totalDiscount} LE` : '0 LE';
    totalInputs[4].value = totalFinal ? `${totalFinal} LE` : '0 LE';
  }
}

// 🔹 زر الإنشاء / التحديث
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
  window.scroll({ top: 0, behavior: 'smooth' });
};

// 🔹 مسح الحقول بعد الإدخال
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

// 🔹 عرض البيانات في الجدول
function showData() {
  let table = '';
  getTotal();

  // ✅ حماية ضد بيانات تالفة
  dataPro = dataPro.filter(item => item && item.title);

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

  updateTotalAccount();
}
showData();

// 🔹 حذف منتج واحد
function deleteData(i) {
  dataPro.splice(i, 1);
  localStorage.product = JSON.stringify(dataPro);
  showData();
}

// 🔹 حذف الكل
function deleteAll() {
  localStorage.clear();
  dataPro = [];
  showData();
}

// 🔹 تعديل منتج
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

// 🔹 البحث
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
    if (searchMood == 'title' && dataPro[i].title.includes(value.toLowerCase())) {
      table += createRow(i);
    } else if (searchMood == 'category' && dataPro[i].category.includes(value.toLowerCase())) {
      table += createRow(i);
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
      <td><button onclick="updateData(${i})">Update</button></td>
      <td><button onclick="deleteData(${i})">Delete</button></td>
    </tr>`;
}

// 🔹 زر الصعود لأعلى
let btuy = document.querySelector('.btu');
window.onscroll = function () {
  btuy.style.display = scrollY >= 400 ? 'block' : 'none';
};
btuy.onclick = function () {
  scroll({ top: 0, behavior: 'smooth' });
};
