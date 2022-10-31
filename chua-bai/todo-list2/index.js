// thêm sp
// hiển thị sản phẩm
// sửa xoá sp
// filer, sort
$(document).ready(()=>{
    let listTask = []
    init()

    function init(){
        let tasks = localStorage.getItem('tasks')
        listTask = JSON.parse(tasks) || []
        render()
    }

    function fillModal(title, body, onOk){
        var modal = $('#createModal')
        modal.find('.modal-title').text(title)
        modal.find('.modal-body input').val(body)
        $('#createModal #btn-confirm').unbind( "click" );
        $('#createModal #btn-confirm').click(()=>{
            let data = {
                title: modal.find('.modal-title').text(),
                body: modal.find('.modal-body input').val()
            }
            onOk(data)
        })

        modal.modal('show')
    }

    function updateTask(data){
        let taskUpdated = listTask.find(item=> item.title == data.title)
        taskUpdated.body = data.body
        localStorage.setItem('tasks', JSON.stringify(listTask))
        render()
        // taskUpdated.
    }

    function render(){
        $('#table-display-product').html('')
        let th = $(`<tr>
        <th>ID</th>
        <th>Task</th>
        <th>Action</th>
        </tr>`)
        $('#table-display-product').append(th)

        listTask.forEach(item=>{
            let tr = $(`<tr>
            <td>${item.title}</td>
            <td>${item.body}</td>
            <td><button type='button'>sua</button></td>
            </tr>`)
            
            tr.find('button').on('click',()=>{
                fillModal(item.title, item.body, updateTask)
            })

            $('#table-display-product').append(tr)
        })
        $('#createModal').modal('hide')
    }

    // add new
    $('#add-product').click(function(){
        fillModal(parseInt(Math.random()*1e7), '', (data)=>{
            listTask.push(data)
            localStorage.setItem('tasks', JSON.stringify(listTask))
            render()
        })
    })

    // update


})


