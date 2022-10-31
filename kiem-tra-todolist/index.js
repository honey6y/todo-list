$(document).ready(() => {
    listData = [];
    inintData();
    let modalEvery = $('#modal-everything')
    let btnAccept = $('#btn-accept')

    let regexDate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
    let regexQuantity = /^[0-9][0-9]*$/
    render();

    $('#add-data').click(() => {
        $('#modal-title').text('Them san pham')
        let id = Math.round(Math.random() * 1000)
        fillModal(id, '', '', '', addData)
    })
    
    // $('#sort-date').click(() => {
    //     sortData('date')
    // })

    $('#sort-date').click(function () {
        $(this).find('.bi-caret-down').toggle(count())
        $(this).find('.bi-caret-up').toggle(count())
        sortData('date')
    })

    $('#sort-name').click(function () {
        $(this).find('.bi-caret-up').toggle(count())
        $(this).find('.bi-caret-down').toggle(count())
        sortData('product')
    })

    $('#display-stoke').click(function () {
        $(this).find('.bi-caret-up').toggle(count())
        $(this).find('.bi-caret-down').toggle(count())
        displayStore()
    })

    $('#display-date').click(function () {
        $(this).find('.bi-caret-up').toggle(count())
        $(this).find('.bi-caret-down').toggle(count())
        displayDate()
    })

    $('#display-done').click(function () {
        $(this).find('.bi-caret-down').toggle(count())
        $(this).find('.bi-caret-up').toggle(count())
        displayDone()
    })

    $('#display-not-yet').click(function () {
        $(this).find('.bi-caret-down').toggle(count())
        $(this).find('.bi-caret-up').toggle(count())
        displayDone(true)
    })

    $('#btn-search').click(() => {
        $('#div-search').toggle()
    })

    $('#input-search').keyup(function () {
        let value = $(this).val().toLowerCase();
        $(".data-row").filter(function() {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    })

    function inintData () {
        let localData = localStorage.getItem('todoList')
        listData = JSON.parse(localData) || []
    }

    function updateLocal () {
        localStorage.setItem('todoList', JSON.stringify(listData))
    }

    function fillModal (id, productName, date, quantity, acceptAction) {
        $('#id-product').val(id)
        $('#name-product').val(productName)
        $('#date-product').val(date)
        $('#quantity-product').val(quantity)

        // $('#name-product').blur(checkName)
        $('#date-product').blur(checkDate)
        // $('#quantity-product').blur(checkQuantity)

        $('#name-product').keyup(checkName)
        $('#date-product').keyup(checkDate)
        $('#quantity-product').keyup(checkQuantity)

        btnAccept.off('click');
        btnAccept.click(() => {
            let confirmName = checkName()
            let confirmDate = checkDate()
            let confirmQuantity = checkQuantity()
            if (confirmName && confirmDate && confirmQuantity) {
                let data = {
                    id: id,
                    product: $('#name-product').val(),
                    date: $('#date-product').val(),
                    quantity: $('#quantity-product').val()
                }
    
                acceptAction(data)
            }
        })

        modalEvery.modal('show')
    }

    function render () {
        $('.table').html('')
        let th = `<tbody>
        <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Date</th>
        <th>Quantity</th>
        <th></th>
        </tr>
        </tbody>`

        $('.table').append(th)
        $('.table').append(listData.length ? '' : '<tr colspan = "5">Khong co data</tr>')

        listData.forEach(element => {
            let tr = $(`<tr class = "data-row">
            <td>${element['id']}</td>
            <td>${element['product']}</td>
            <td>${element['date']}</td>
            <td>${element['quantity']}</td>
            <td>
                <i class="bi bi-wrench-adjustable adj-data"></i>
                <i class="bi bi-trash delete-data"></i>
            </td>
            </tr>
            `)
            tr.find('.adj-data').click(() => {
                $('#modal-title').text('Sua data')
                $('#name-product').prop('readonly', false)
                $('#date-product').prop('readonly', false)
                $('#quantity-product').prop('readonly', false)
                fillModal(element['id'], element['product'], element['date'], element['quantity'], adjustData)
            })

            tr.find('.delete-data').click(() => {
                $('#modal-title').text('Xoa data')
                $('#name-product').prop('readonly', true)
                $('#date-product').prop('readonly', true)
                $('#quantity-product').prop('readonly', true)
                fillModal(element['id'], element['product'], element['date'], element['quantity'], deleteData)
            })
            $('.table').append(tr)
        });

        modalEvery.modal('hide')
    }

    function addData (data) {
        listData.push(data);
        updateLocal();
        render();
    }

    function adjustData (data) {
        let itemAdj = listData.find(element => element['id'] == data['id'])
        itemAdj['product'] = data['product'];
        itemAdj['date'] = data['date'];
        itemAdj['quantity'] = data['quantity'];
        updateLocal();
        render();
    }

    function deleteData (data) {
        let itemDelete = listData.findIndex(element => element['id'] == data['id'])
        listData.splice(itemDelete, 1);
        updateLocal();
        render();
    }

    function checkName () {
        let checkName = true
        let nameData = $('#name-product')
        if (nameData.val().trim().length < 6) {
            checkName = false
            nameData.next().removeClass('none')
        } else {
            checkName = true
            nameData.next().addClass('none')
        }
        return checkName;
    }

    function checkDate () {
        let checkDate = true
        let dateData = $('#date-product')
        if (!regexDate.test(dateData.val())) {
            checkDate = false
            dateData.next().removeClass('none')
        } else {
            checkDate = true
            dateData.next().addClass('none')
        }

        return checkDate
    }

    function checkQuantity () {
        let checkQuantity = true;
        let quantityData = $('#quantity-product')
        if (!regexQuantity.test(quantityData.val())) {
            checkQuantity = false
            quantityData.next().removeClass('none')
        } else {
            checkQuantity = true
            quantityData.next().addClass('none')
        }

        return checkQuantity
    }

    //biến count dùng để thay NHIỀU biến toàn cục trong việc sắp xếp 2 chiều
    //chưa được hoàn chỉnh, tối ưu
    const count = (function () {
        let result = false
        return function () {
            result = result ? false : true
            return result;
        }
    })();

    function sortData(rule) {
        if (count()) {
            listData.sort((a,b) => {
                if (a[rule] < b[rule]) {
                    return 0;
                } else {
                    return -1;
                }
            })
        } else {
            listData.sort((a,b) => {
                if (a[rule] > b[rule]) {
                    return 0;
                } else {
                    return -1;
                }
            })
        }
        updateLocal();
        render();
    }

    function displayStore () {
        sortData('quantity')
        updateLocal();
        render()
        let rowData = $('.data-row')
        rowData.removeClass('none')
        rowData.removeClass('date')
        listData.forEach((element, index) => {
            if (element['quantity'] <= 0) {
                rowData.eq(index).addClass('out-of-stock')
            }
        })
    }

    function displayDate () {
        sortData('date')
        updateLocal();
        render()
        let rowData = $('.data-row')
        rowData.removeClass('none')
        rowData.removeClass('out-of-stock')
        let minute = 60 * 1000
        let hour = 60 * minute
        let day = hour * 24
        let today = Date.now()
        listData.forEach((element, index) => {
            let dataDate = new Date(element['date'])
            if (((dataDate.getTime() - today) / day) < 1) {
                rowData.eq(index).addClass('date')
            }
        })
    }

    function displayDone (condition) {
        sortData('date')
        updateLocal();
        render()
        let rowData = $('.data-row')
        rowData.removeClass('none')
        rowData.removeClass('out-of-stock')
        rowData.removeClass('date')
        let minute = 60 * 1000
        let hour = 60 * minute
        let day = hour * 24
        let today = Date.now()
        if (condition) {
            listData.forEach((element, index) => {
                let dataDate = new Date(element['date'])
                if (((dataDate.getTime() - today) / day) <= -1) {
                    rowData.eq(index).addClass('none')
                }
            })
        } else {
            listData.forEach((element, index) => {
                let dataDate = new Date(element['date'])
                if (((dataDate.getTime() - today) / day) > -1) {
                    rowData.eq(index).addClass('none')
                }
            })
        }
        
    }
    
})