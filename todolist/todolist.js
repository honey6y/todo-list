let localData = localStorage.getItem("listSP");

let dataProduct = localData ? JSON.parse(localData) : [];
render();
const idSp = $("#inp-id").val();
const nameSp = $("#inp-tenSP").val();
const quantitySp = $("#inp-quantity").val();
const priceSp = $("#inp-price").val();
const dateSp = $("#inp-date").val();

function validate(idSp, nameSp, quantitySp, priceSp, dateSp) {
  if (
    idSp.length < 1 ||
    nameSp.length < 1 ||
    quantitySp.length < 1 ||
    priceSp.length < 1 ||
    dateSp.length < 1
  ) {
    alert("vui long nhap day du thong tin");
    return false;
  } else if (idSp.length < 2) {
    $(".text-warn-id").removeClass("hidden");
    return false;
  } else if (nameSp.length < 6) {
    $(".text-warn-name").removeClass("hidden");
    return false;
  } else if (quantitySp.length < 2) {
    $(".text-warn-quantity").removeClass("hidden");
  } else if (priceSp.length < 2) {
    $(".text-warn-price").removeClass("hidden");
    return false;
  } else {
    $(".text").remove();
    return true;
  }
}

function add() {
  let check = false;
  const idSp = $("#inp-id").val();
  const nameSp = $("#inp-tenSP").val();
  const quantitySp = $("#inp-quantity").val();
  const priceSp = $("#inp-price").val();
  const dateSp = $("#inp-date").val();

  const itemProduct = {
    id: idSp,
    name: nameSp,
    quantity: quantitySp,
    price: priceSp,
    date: dateSp,
  };
  console.log(1, itemProduct);
  let validatecheck = validate(idSp, nameSp, quantitySp, priceSp, dateSp);
  dataProduct.forEach((element) => {
    console.log(element.id);
    if (element.id == idSp) {
      check = true;
    }
  });

  if (validatecheck) {
    if (check) {
      alert("ID da ton tai");
    } else {
      dataProduct.push(itemProduct);
      render();
      localStorage.setItem("listSP", JSON.stringify(dataProduct));
    }
  }
  localStorage.setItem("list", JSON.stringify(dataProduct));
  console.log(dataProduct);
}

function render() {
  let table = `
  <tr>
    <td>ID</td>
    <td>Ten SP</td>
    <td>SỐ lượng</td>
    <td>Giá tiền</td>
    <td>Ngày tháng</td>
    <td>action</td>
  </tr>`;

  dataProduct.forEach((element) => {
    table += `
    <tr class = "data-row">
        <td>${element.id}</td>
        <td>${element.name} </td>
        <td>${element.quantity}</td>
        <td>${element.price}</td>
        <td>${element.date}</td>
        <td>
        <button onClick="openEditModal('${element.id}')">
        <i class="fa-solid fa-wrench"></i>
        </button>
        <button onClick ="openDeleteModal('${element.id}')">
        <i class="fa-solid fa-trash"></i>
        </button>
        </td>
    
    </tr>`;
  });
  document.querySelector("#task-table").innerHTML = table;
}

// document.querySelector("#task-table").innerHTML = "chua co san pham";
