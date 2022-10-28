let dataLocal = localStorage.getItem('product')
const dataPorduct = dataLocal ? JSON.parse(dataLocal) : []

const modal = $('#modal-everything')
const modalTitle = $('.modal-title')
const modalBody = $('.modal-body')
const btnCloseModal = $('#close-modal')
const btnAcceptAction = $('#accept-action')
const btnAdd = $('#add-product');

const btnSortDate = $('#sort-date-product')
const btnSortName = $('#sort-name-product')
const btnDisplayStore = $('#display-condition')
const btnDisplayComplete = $('#display-complete')
const quantityRegex = /^\d+$/
const dateRegex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
let checkAddProduct = false

let checkFixData = false
let confirmRemoveData = false
let confirmIdRemove = null;

let sortDate = false
let sortName = false


document.querySelector('#modal-everything').addEventListener('hidden.bs.modal', event => {
    checkAddProduct = false
    checkFixData = false
    checkRemoveProduct = false
    confirmRemoveData = false
    confirmIdRemove = null
})

btnAdd.click(() => {
    checkAddProduct = true
    modalTitle.html('Them san pham')
    modalBody.html((i, origin) => {
        return `
            <div>
                <label for="add-product-name">Name</label>
                <input type="text" name="add-product-name" id="add-product-name">
                <p class="none">Name phai co tu 6 ky tu tro len</p>
            </div>
            <div>
                <label for="add-product-date">Date</label>
                <input type="date" name="add-product-date" placeholder="dd-mm-yyy" id="add-product-date">
                <p class="none">vui long nhap dung dinh dang date la dd-mm-yyy</p>
            </div>
            <div>
                <label for="add-product-quantity">Quantity</label>
                <input type="number" name="add-product-quantity" id="add-product-quantity">
                <p class="none">vui long nhap dung dinh dang so luong la 1 so</p>
            </div>`
    })

    btnCloseModal.removeClass('none')
    btnCloseModal.html('Huy bo')
    btnAcceptAction.html('Them san pham')
    modal.modal('show')
})

btnAcceptAction.click(() => {
    let checkName = false
    let checkDate = false
    let checkQuantity = false
    let productName = $('#add-product-name')
    let productDate = $('#add-product-date')
    let productQuantity = $("#add-product-quantity")
    if (checkAddProduct || checkFixData) {
    
        if (!dateRegex.test(productDate.val())) {
            productDate.next().removeClass('none')
            checkDate = true
        } else {
            productDate.next().addClass('none')
            checkDate = false
        }
        if (!quantityRegex.test(productQuantity.val())) {
            productQuantity.next().removeClass('none')
            checkQuantity = true
        } else {
            productQuantity.next().addClass('none')
            checkQuantity = false
        }
        if (productName.val().trim().length < 6) {
            productName.next().removeClass('none')
            checkName = true
        } else {
            productName.next().addClass('none')
            checkName = false
        }
    }

    if (checkAddProduct) {
        if (!checkName && !checkDate && !checkQuantity) {
            let checkDuplicate = false
            dataPorduct.forEach(element => {
                if (element.name === productName.val()) {
                    checkDuplicate = true
                }
            })

            if(checkDuplicate) {
                alert('Ten san pham da ton tai')
            } else {
                dataPorduct.push({
                    id: Math.random().toString(10).slice(2),
                    name: productName.val().trim(),
                    date: productDate.val(),
                    quantity: productQuantity.val()
                })
    
                render(dataPorduct)
                modal.modal('hide')
                localStorage.setItem('product', JSON.stringify(dataPorduct))
            }
        }
    }

    if (checkFixData) {
        if (!checkName && !checkDate && !checkQuantity) {
            let dataFix = dataPorduct.find(element => element.id == $('#id-product-fix').val())
            dataFix.name = $('#add-product-name').val()
            dataFix.date = $('#add-product-date').val()
            dataFix.quantity = $('#add-product-quantity').val()

            render(dataPorduct)
            modal.modal('hide')
            localStorage.setItem('product', JSON.stringify(dataPorduct))
        }
    }

    if (confirmRemoveData) {
        let indexRemove = null;
        dataPorduct.forEach ((element, index) => {
            if (element.id == confirmIdRemove) {
                indexRemove = index
            }
        })
        dataPorduct.splice(indexRemove, 1)
        render(dataPorduct)
        modal.modal('hide')
        localStorage.setItem('product', JSON.stringify(dataPorduct))
    }

})

btnSortDate.click(() => {
    if(sortDate) {
        dataPorduct.sort((a, b) => {
            if (a.date > b.date) {
                return 0
            } else if (a.date < b.date) {
                return -1
            } else {
                return a.name > b.name ? 0 : -1 
            }
        })
        // console.log(dataPorduct);
        sortDate = false
    } else {
        dataPorduct.sort((a, b) => {
            if (a.date > b.date) {
                return -1
            } else if (a.date < b.date) {
                return 0
            } else {
                return a.name < b.name ? 0 : -1 
            }
        })
        // console.log(dataPorduct);
        sortDate = true
    }
    render(dataPorduct)
})

btnSortName.click(() => {
    if(sortName) {
        dataPorduct.sort((a, b) => {
            if (a.name > b.name) {
                return 0
            } else if (a.name < b.name) {
                return -1
            } else {
                return a.date > b.date ? 0 : -1 
            }
        })
        // console.log(dataPorduct);
        sortName = false
    } else {
        dataPorduct.sort((a, b) => {
            if (a.name > b.name) {
                return -1
            } else if (a.name < b.name) {
                return 0
            } else {
                return a.date < b.date ? 0 : -1 
            }
        })
        // console.log(dataPorduct);
        sortName = true
    }
    render(dataPorduct)
})

btnDisplayStore.click(() => {
    const dataRow = $('.data-row')
    
    if (btnDisplayStore.html() === 'Display Store') {
        dataPorduct.forEach((element, index) => {
            dataRow.eq(index).removeClass('none')
            dataRow.eq(index).removeClass('date-one-day')
            if (element.quantity == 0) {
                dataRow.eq(index).addClass('out-of-stock')
            } else {
                dataRow.eq(index).addClass('stocking')
            }
        })
        btnDisplayStore.html('Display Date')
    } else {
        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;
        let today = Date.now()
        dataPorduct.forEach((element, index) => {
            dataRow.eq(index).removeClass('none')
            dataRow.eq(index).removeClass('out-of-stock')
            dataRow.eq(index).removeClass('stocking')
            let dateOutDate = Date.parse(element.date)
            let dayToOutDate = Math.floor((dateOutDate - today) / day)
            if (dayToOutDate < 1) {
                dataRow.eq(index).addClass('date-one-day')
            }
        })
        btnDisplayStore.html('Display Store')
    }
    
})

btnDisplayComplete.click(() => {
    const dataRow = $('.data-row')
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    let today = Date.now()
    if (btnDisplayComplete.html() === 'Display Complete') {
        btnDisplayComplete.html('Display Incomplete')
        dataPorduct.forEach((element, index) => {
            dataRow.eq(index).removeClass('none')
            dataRow.eq(index).removeClass('out-of-stock')
            dataRow.eq(index).removeClass('stocking')
            dataRow.eq(index).removeClass('date-one-day')
            let dateOutDate = Date.parse(element.date)
            let dayToOutDate = dateOutDate - today
            if (dayToOutDate > 0) {
                dataRow.eq(index).addClass('none')
            }
        })
    } else {
        btnDisplayComplete.html('Display Complete')
        dataPorduct.forEach((element, index) => {
            dataRow.eq(index).removeClass('none')
            dataRow.eq(index).removeClass('out-of-stock')
            dataRow.eq(index).removeClass('stocking')
            dataRow.eq(index).removeClass('date-one-day')
            let dateOutDate = Date.parse(element.date)
            let dayToOutDate = dateOutDate - today
            if (dayToOutDate <= 0) {
                dataRow.eq(index).addClass('none')
            }
        })
    }
        
        
        
})

function deleteData(id) {
    confirmRemoveData = true
    confirmIdRemove = id
    modalTitle.html('Xac nhan xoa san pham')
    modalBody.html('Ban co chac chan muon xoa san pham?')
    btnCloseModal.removeClass('none')
    btnCloseModal.html('Huy bo')
    btnAcceptAction.html('Xac nhan xoa')
    modal.modal('show')
}


function adjData (id) {
    checkFixData = true
    btnCloseModal.addClass('none')
    btnAcceptAction.html('Hoan tat chinh sua')
    modalTitle.html('Chinh sua san pham')
    
    modalBody.html((i, origin) => {
        return `
            <div>
                <label for="id-product-fix">ID</label>
                <input type="text" name="id-product-remove" id="id-product-fix" value="${id}" readonly>
            </div>
            <div>
                <label for="add-product-name">Name</label>
                <input type="text" name="add-product-name" id="add-product-name">
                <p class="none">Name phai co tu 6 ky tu tro len</p>
            </div>
            <div>
                <label for="add-product-date">Date</label>
                <input type="date" name="add-product-date" placeholder="yyyy-mm-dd" id="add-product-date">
                <p class="none">vui long nhap dung dinh dang date la yyyy-mm-dd</p>
            </div>
            <div>
                <label for="add-product-quantity">Quantity</label>
                <input type="number" name="add-product-quantity" id="add-product-quantity">
                <p class="none">vui long nhap dung dinh dang so luong la 1 so</p>
            </div>`
    })

    let dataFix = dataPorduct.find(element => element.id == id)

    $('#add-product-name').val(`${dataFix.name}`)
    $('#add-product-date').val(`${dataFix.date}`)
    $("#add-product-quantity").val(`${dataFix.quantity}`)
    modal.modal('show')
}


function render (dataPorduct) {
    const tableDisplay = $('#table-list')
    tableDisplay.html((i, origin) => {
        return `<tbody>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Quantity</th>
                <th></th>
            </tr>
        </tbody>`
    })
    if (!dataPorduct.length) {
        tableDisplay.html((i, origin) => {
            return origin + `<tr>
                <td colspan = '5'>khong co san pham</td>
                </tr>`
        })
    } else {
        dataPorduct.forEach(element => {
            tableDisplay.html((i, origin) => {
                return origin + `<tr class = "data-row">
                <td>San pham_${element.id}</td>
                <td>${element.name}</td>
                <td>${element.date}</td>
                <td>${element.quantity}</td>
                <td>
                <i class="bi bi-wrench-adjustable" onclick="adjData(${element.id})"></i>
                <i class="bi bi-trash" onclick="deleteData(${element.id})"></i>
                </td>
            </tr>`
            })
        });   
    }
}

render(dataPorduct)