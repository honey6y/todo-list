$(document).ready(function () {
    let listData = [];
    initData();
    
    const modalWorking = $('#modal-everything')
    const btnAccept = $('#accept-action')
    render();

    const regexCheckDate = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
    const regexCheckQuantity = /^[0-9][0-9]*$/
    
    function initData () {
        let localData = localStorage.getItem('dataProduct');
        listData = JSON.parse(localData) || [];
    }
    
    function updateData () {
        localStorage.setItem('dataProduct', JSON.stringify(listData));
    }
    
    function render () {
        $('#table-list').html('')

        let th = `<tbody>
            <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Date</th>
            <th>Quantity</th>
            <th></th>
            </tr>
            </tbody>`

        $('#table-list').append(th)
        $('#table-list').append(listData.length ? '' : '<tr><td colspan = 5>Khong co data</td></tr>')

        listData.forEach ((element) => {
            let tr = $(`<tr class = "data-row">
                <td>${element.id}</td>
                <td>${element.name}</td>
                <td>${element.date}</td>
                <td>${element.quantity}</td>
                <td>
                    <i class="bi bi-wrench-adjustable" class="adj-data"></i>
                    <i class="bi bi-trash" class = "delete-data"></i>
                </td>
                </tr>`)
            
            tr.find('i').eq(0).click(() => {
                $('#modal-title').text('sua san pham')
                $('#data-name').prop('readonly', false)
                $('#data-date').prop('readonly', false)
                $('#data-quantity').prop('readonly', false)
                fillModal(element.id, element.name, element.date, element.quantity, adjustData)
            })
    
            tr.find('i').eq(1).click(() => {
                $('#data-name').prop('readonly', true)
                $('#data-date').prop('readonly', true)
                $('#data-quantity').prop('readonly', true)
                $('#modal-title').text('xoa san pham')
                fillModal(element.id, element.name, element.date, element.quantity, deleteData)
            })
    
            $('#table-list').append(tr)
        })
        modalWorking.modal('hide')
    }

    function addData (data) {
        listData.push(data)
        updateData()
        render()
    }
    
    function adjustData (data) {
        let adjData = listData.find(item => item.id == data.id)
        adjData.name = data.name
        adjData.date = data.date
        adjData.quantity = data.quantity
        updateData()
        render()
    }
    
    function deleteData (data) {
        document.getElementById('modal-title').textContent = 'Xoa san pham'
        let indexRemove = listData.findIndex(item => item.id == data.id)
        listData.splice(indexRemove, 1)
        updateData()
        render()
    }
    
    function checkName () {
        let checkName = false
        let dataName = $('#data-name').val()

        if (dataName.trim().length < 6) {
            checkName = false
            $('#data-name').next().removeClass('none')
        } else {
            checkName = true
            $('#data-name').next().addClass('none')
        }

        return checkName
    }

    function checkDate () {
        let checkDate = false

        let dataDate = $('#data-date').val()

        if (!regexCheckDate.test(dataDate)) {
            checkDate = false
            $('#data-date').next().removeClass('none')
        } else {
            checkDate = true
            $('#data-date').next().addClass('none')
        }

        return checkDate
    }
    
    function checkQuantity () {
        let checkQuantity = false

        let dataQuantity = $('#data-quantity').val()

        if (!regexCheckQuantity.test(dataQuantity)) {
            checkQuantity = false
            $('#data-quantity').next().removeClass('none')
        } else {
            checkQuantity = true
            $('#data-quantity').next().addClass('none')
        }

        return checkQuantity
    }

    function resetModal () {
        $('#data-name').next().addClass('none')
        $('#data-date').next().addClass('none')
        $('#data-quantity').next().addClass('none')
    }

    // fill data cho modal, gắn sự kiện cho nút accept hanh dong voi data cua modal body
    function fillModal (id, name, date, quantity, onAccept) {
        $('#data-id').val(id)
        $('#data-name').val(name)
        $('#data-date').val(date)
        $('#data-quantity').val(quantity)

        $('#data-name').keyup(checkName)
        $('#data-date').keyup(checkDate)
        $('#data-quantity').keyup(checkQuantity)

        btnAccept.off('click')
        btnAccept.click(() => {
            let dataName = checkName()
            let dataDate = checkDate()
            let dataQuantity = checkQuantity()
            
            if (dataName && dataDate && dataQuantity) {
                let data = {
                    id: id,
                    name: $('#data-name').val(),
                    date: $('#data-date').val(),
                    quantity: $('#data-quantity').val()
                }
        
                onAccept(data)
            }
                
        })
        modalWorking.modal('show')
    }

    const add = (function () {
        let reverse = 0
        return function () {
            reverse ++
            return reverse;
        }
    })();

    function sortData (rule) {
        if (add() % 2 == 0) {
            listData.sort((a, b) => {
                if (a[rule] > b[rule]) {
                    return 0
                } else {
                    return -1
                }
            })
        } else {
            listData.sort((a, b) => {
                if (a[rule] < b[rule]) {
                    return 0
                } else {
                    return -1
                }
            })
        }
        
        updateData()
        render();
    }
    
    function displayStoke () {
        let rowData = $('.data-row')
        rowData.removeClass('date')
        rowData.removeClass('none')
        listData.forEach ((element, index) => {
            if (element.quantity <= 0) {
                rowData.eq(index).addClass('out-of-stock')
            }
        })
    }

    function displayOutDate () {
        let rowData = $('.data-row')
        rowData.removeClass('out-of-stock')
        rowData.removeClass('none')
        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;
        let today = Date.now()
        listData.forEach ((element, index) => {
            let dateOutDate = Date.parse(element.date)
            let dayToOutDate = Math.floor((dateOutDate - today) / day)
            if (dayToOutDate < 1) {
                rowData.eq(index).addClass('date')
            }
        })
    }

    function filterData () {
        let rowData = $('.data-row')
        rowData.removeClass('out-of-stock')
        rowData.removeClass('date')
        rowData.removeClass('none')
        const minute = 1000 * 60;
        const hour = minute * 60;
        const day = hour * 24;
        let today = Date.now()
        if (add() % 2 == 0) {
            $('#display-complete').text('Display Incomplete')
            listData.forEach ((element, index) => {
                let dateOutDate = Date.parse(element.date)
                let dayToOutDate = dateOutDate - today
                if (dayToOutDate < 0) {
                    rowData.eq(index).addClass('none')
                }
            })
        } else {
            $('#display-complete').text('Display Complete')
            listData.forEach ((element, index) => {
                let dateOutDate = Date.parse(element.date)
                let dayToOutDate = dateOutDate - today
                if (dayToOutDate > 0) {
                    rowData.eq(index).addClass('none')
                }
            })
        }
    }

    $('#add-product').click(() => {
        $('#modal-title').text('Them san pham')
        $('#data-name').prop('readonly', false)
        $('#data-date').prop('readonly', false)
        $('#data-quantity').prop('readonly', false)
        let id = Math.round(Math.random() * 1000)
        fillModal(id, '', '', '', addData)
    })

    $('#sort-date-product').click(() => {
        sortData('date')
    })

    $('#sort-name-product').click(() => {
        sortData('name')
    })

    $('#display-store').click(() => {
        displayStoke();
    })

    $('#display-date').click(() => {
        displayOutDate();
    })

    $('#display-complete').click(() => {
        filterData();
    })

    $('#modal-everything').on('hide.bs.modal', () => {
        resetModal()
    })

})