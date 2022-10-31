let localData = localStorage.getItem('productData');
const productData = localData ? JSON.parse(localData) : []

const tableDisplay = $('#table-display-product')
const btnAdd = $('#add-product')
const modalWorking = $('#exampleModal')
// modalWorking.modal('show')
const modalTitle = $('#exampleModalLabel')
const modalBody = $('.modal-body')
const btnCancel = $('#btn-cancel')
const btnConfirm = $('#btn-confirm')
const btnSortDate = $('#sort-date')
const btnSortName = $('#sort-name')
const btnDisplayCondition = $('#display-condition')
const btnDisplayComplete = $('#display-complete')


let checkAddData = false
let checkFixData = false
let checkDeleteData = false
let idDeleteData = null

let sortDate = false
let sortName = false

document.querySelector('#exampleModal').addEventListener('hidden.bs.modal', event => {
    checkAddData = false
    checkFixData = false
    checkDeleteData = false
    idDeleteData = null
})


btnConfirm.click(() => {

    //kiem tra dieu kien input
    let checkNameData = true
    let checDateData = true
    let checkQuantityData = true
    if (checkAddData || checkFixData) {
        const dataName = $('#add-data-name')
        const dataDate = $('#add-data-date')
        let checkDateData = new Date(dataDate.val())
        
        const quantityData = $('#add-data-quantity')

        if (dataName.val().trim().length < 6) {
            checkNameData = false
            dataName.next().removeClass('none')
        } else {
            checkNameData = true
            dataName.next().addClass('none')
        }

        if (checkDateData instanceof Date && !isNaN(checkDateData.valueOf())) {
            checDateData = true
            dataDate.next().addClass('none')
        } else {
            checDateData = false
            dataDate.next().removeClass('none')
        }

        if (isNaN(parseFloat(quantityData.val()))) {
            checkQuantityData = false
            quantityData.next().removeClass('none')
        } else {
            checkQuantityData = true
            quantityData.next().addClass('none')
        }
    }

    if (checkNameData && checDateData && checkQuantityData) {

        //them data
        if (checkAddData) {
            let checkDuplicate = false
            productData.forEach(element => {
                if (element.product === $('#add-data-name').val()) {
                    checkDuplicate = true
                }
            })

            if (checkDuplicate) {
                alert('Ten san pham da ton tai')
            } else {
                productData.push({
                    id: Math.random().toString(10).slice(2),
                    product: $('#add-data-name').val(),
                    date: $('#add-data-date').val(),
                    quantity: $('#add-data-quantity').val()
                })
        
                render(productData)
                localStorage.setItem('productData', JSON.stringify(productData));
                modalWorking.modal('hide')
            }
            
        }
        
        //chinh sua data
        if (checkFixData) {
            let dataFix = productData.find(element => element.id == $('#add-data-id').val())
            dataFix.product = $('#add-data-name').val()
            dataFix.date = $('#add-data-date').val()
            dataFix.quantity = $('#add-data-quantity').val()
            render(productData)
            localStorage.setItem('productData', JSON.stringify(productData));
            modalWorking.modal('hide')
        }
    }

    //xoa data
    if (checkDeleteData) {
        let indexDelete = productData.findIndex(element => element.id == idDeleteData)
        productData.splice(indexDelete, 1)
        render(productData)
        localStorage.setItem('productData', JSON.stringify(productData));
        modalWorking.modal('hide')
    }
})


//modal khi them data
btnAdd.click(() => {
    checkAddData = true;
    modalTitle.html('Them san pham')
    modalBody.html(() => {
        return `<div>
                <label for="add-data-name">Name product</label>
                <input type="text" name="add-data-name" id="add-data-name">
                <p class="none">Ten san pham phai co 6 ky tu tro len</p>
            </div>
            <div>
                <label for="add-data-date">Date</label>
                <input type="date" name="add-data-date" id="add-data-date">
                <p class="none">Vui long nhap dung dinh dang date</p>
            </div>
            <div>
                <label for="add-data-quantity">Quantity</label>
                <input type="number" name="add-data-quantity" id="add-data-quantity" min="0">
                <p class="none">So luong san pham phai lon hon 0</p>
            </div>`
    })
    // modalBody.children().keypress((event) => {
    //     // console.log('da vao');
    //     if (event.which == 13) {
    //         console.log('vao tiep');
    //         btnConfirm.click()
    //     }
    // })
    btnCancel.html('Huy bo')
    btnConfirm.html('Xac nhan')
    modalWorking.modal('show')
})

//modal khi xoa data
function deleteData(id) {
    checkDeleteData = true;
    idDeleteData = id;
    modalTitle.html('Xoa san pham')
    modalBody.html('Ban co chac chan muon xoa san pham?')
    btnCancel.html('Huy bo')
    btnConfirm.html('Xac nhan')
    modalWorking.modal('show')
    
    // if (checkDeleteData) {
    //     $(document).keypress((event) => {
    //         event.preventDefault();
    //         // console.log('da vao');
    //         if (event.which == 13) {
    //             // console.log('vao tiep');
    //             $('html').off('keypress')
    //             btnConfirm.click()
    //             // checkDeleteData = false
    //         }
    //     })
    // }
}

//modal khi chinh sua data
function adjData(id) {
    checkFixData = true;
    let dataFix = productData.find(value => value.id == id)
    modalTitle.html('Sua thong tin san pham')
    modalBody.html((i, origin) => {
        return `
            <div>
            <label for="add-data-id">ID</label>
            <input type="text" name="add-data-id" id="add-data-id" value="${id}" readonly>
            </div>
            <div>
                <label for="add-data-name">Name product</label>
                <input type="text" name="add-data-name" id="add-data-name">
                <p class="none">Ten san pham phai co 6 ky tu tro len</p>
            </div>
            <div>
                <label for="add-data-date">Date</label>
                <input type="date" name="add-data-date" id="add-data-date">
                <p class="none">Vui long nhap dung dinh dang date</p>
            </div>
            <div>
                <label for="add-data-quantity">Quantity</label>
                <input type="number" name="add-data-quantity" id="add-data-quantity" min="0">
                <p class="none">So luong san pham phai lon hon 0</p>
            </div>`
    })

    // modalBody.children().keypress((event) => {
    //     console.log('da vao');
    //     if (event.which == 13) {
    //         console.log('vao tiep');
    //         btnConfirm.click()
    //     }
    // })
    $('#add-data-name').val(`${dataFix.product}`)
    $('#add-data-date').val(`${dataFix.date}`)
    $('#add-data-quantity').val(`${dataFix.quantity}`)
    btnCancel.html('Huy bo')
    btnConfirm.html('Xac nhan')
    modalWorking.modal('show')
}

//sap xep theo date
btnSortDate.click(() => {
    if (sortDate) {
        sortDate = false
        productData.sort((a, b) => {
            if (a.date > b.date) {
                return 0
            } else if (a.date > b.date) {
                return a.product > b.product ? 0 : -1
            } else {
                return -1
            }
        })
        render(productData)
        localStorage.setItem('productData', JSON.stringify(productData));

    } else {
        sortDate = true
        productData.sort((a, b) => {
            if (a.date > b.date) {
                return -1
            } else if (a.date > b.date) {
                return a.product > b.product ? 0 : -1
            } else {
                return 0
            }
        })
        render(productData)
        localStorage.setItem('productData', JSON.stringify(productData));
    }
    
})

//sap xep theo ten
btnSortName.click(() => {
    if (sortName) {
        sortName = false
        productData.sort((a, b) => a.product > b.product ? 0 : -1)
        render(productData)
        localStorage.setItem('productData', JSON.stringify(productData));
    } else {
        sortName = true
        productData.sort((a, b) => a.product > b.product ? -1 : 0)
        render(productData)
        localStorage.setItem('productData', JSON.stringify(productData));
    }
})

// hien thi theo ton kho hoac date
btnDisplayCondition.click(() => {
    const dataRow = $('.data-row')
    if (btnDisplayCondition.html() == 'Display Storing') {
        btnDisplayCondition.html('Display Date')
        productData.forEach((element, index) => {
            dataRow.eq(index).removeClass('none')
            dataRow.eq(index).removeClass('date-one-day')
            if (element.quantity == 0) {
                dataRow.eq(index).addClass('out-of-stock')
            } else {
                dataRow.eq(index).addClass('stocking')
            }
        })
    } else {
        btnDisplayCondition.html('Display Storing')
        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;
        let today = Date.now()
        productData.forEach((element, index) => {
            dataRow.eq(index).removeClass('none')
            dataRow.eq(index).removeClass('out-of-stock')
            dataRow.eq(index).removeClass('stocking')
            let dateOutDate = Date.parse(element.date)
            let dayToOutDate = Math.floor((dateOutDate - today) / day)
            if (dayToOutDate < 1) {
                dataRow.eq(index).addClass('date-one-day')
            }
        })
    }
})

//hien thi hoan thanh hoac chua hoan thanh
btnDisplayComplete.click(() => {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    let today = Date.now()
    const dataRow = $('.data-row')
    
    if (btnDisplayComplete.html() == 'Display Complete') {
        btnDisplayComplete.html('Display Incomplete')
        productData.forEach((element, index) => {
            dataRow.eq(index).removeClass('none')
            dataRow.eq(index).removeClass('out-of-stock')
            dataRow.eq(index).removeClass('stocking')
            dataRow.eq(index).removeClass('date-one-day')
            let dateOutDate = Date.parse(element.date)
            let dayToOutDate = (dateOutDate - today) / day
            if (dayToOutDate > 0) {
                dataRow.eq(index).addClass('none')
            }
        })
    } else {
        btnDisplayComplete.html('Display Complete')
        productData.forEach((element, index) => {
            dataRow.eq(index).removeClass('none')
            dataRow.eq(index).removeClass('out-of-stock')
            dataRow.eq(index).removeClass('stocking')
            dataRow.eq(index).removeClass('date-one-day')
            let dateOutDate = Date.parse(element.date)
            let dayToOutDate = (dateOutDate - today) / day
            if (dayToOutDate < 0) {
                dataRow.eq(index).addClass('none')
            }
        })
    }
})

//render data
function render(data) {
    tableDisplay.html(() => {
        let dataRender = `<tbody>
            <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Date</th>
            <th>Quantity</th>
            <th></th>
            </tr>
            </tbody>`

        if (!productData.length) {
            dataRender += `<tr>
                <td colspan="5">Khong co san pham nao</td>
                </tr>`
        } else {
            productData.forEach(element => {
                dataRender += `<tr class = "data-row">
                    <td>SanPham_${element.id}</td>
                    <td>${element.product}</td>
                    <td>${element.date}</td>
                    <td>${element.quantity}</td>
                    <td>
                        <i class="bi bi-wrench-adjustable" onclick = "adjData(${element.id})"></i>
                        <i class="bi bi-trash" onclick = "deleteData(${element.id})"></i>
                    </td>
    
                    </tr>`
            });
        }
        // console.log(dataRender);
        return dataRender
    })
}

render(productData)