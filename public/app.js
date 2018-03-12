/* global $ */
var list = []; // delete record update store is not hanndled
$(document).ready(function () {
    $.getJSON('/api/todos')
    .then( addTodos )
    .catch(function (error) {
        console.log(error);
    })
    
    $('#todoInput').keypress(function (e) {
        var todo = {};
        if(e.keyCode === 13){
            todo.name = $(this).val();
            addNewTodo(todo);
        }
    })
});



function addTodos(todos) {
    var sortedList = todos.sort((a,b) => {
        let x = a.created_date,
        y = b.created_date;
        return new Date(y) - new Date(x);
    });
    list = sortedList;
    todos.forEach(function (todo) {
        var newTodoDOM = newDOMElement(todo);
        $('ul.list').append(newTodoDOM);    

    })
}

function addNewTodo(todo) {
    var successCallback = function(todo) {
        var newTodoDOM = newDOMElement(todo);
        $('ul.list').prepend(newTodoDOM);
        $('#todoInput').val('');
        list.push(todo);
        
    }
    
    $.post('/api/todos', todo, successCallback);
}

function deleteTask(evt) {
    event.stopPropagation();
    var id = evt.target.id.slice(4);
    var todo = list.find(function(element) {
        return element._id ==  id;
    });
    data = {_id: id};
    
    console.log('remove element with id ', id);
    var callback = function ( todo ) {
        removeElement(id);
        console.log('successfully removee the element ', id, todo);

    }
    var url = '/api/todos/' + id;

    $.ajax({
      url: url,
      type: 'DELETE',
      data: todo,
      success: callback
    });
}

function removeElement(id) {
    var targetEl = $('#'+ id ).parent();
    targetEl.remove();
}


function changeElement(target, todo) {
    var targetEl = $(target),
        parentListItem = targetEl.parent(),
        deleteButton = $('<div class="todo-col-btn"><button id="del-'+todo._id+'" class="delete">delete</button></div>');
    
    var hasClassDone = targetEl.hasClass('done');
    console.log('completed, hasClass', todo.completed, hasClassDone);
    deleteButton.on('click', deleteTask);

    if(todo.completed){
        if(!hasClassDone) {
            targetEl.addClass('done');
            parentListItem.append(deleteButton);
        }
    } else {
        if(hasClassDone){
            targetEl.removeClass('done');
            $('#del-'+ todo._id).remove();
        }
    }
}

function newDOMElement(todo) {
    var newTodo = $('<li></li>'),
        newTaskNameDiv = $('<div class="todo-col-msg"  id="'+todo._id+'"> ' + todo.name  +'</div>'),
        deleteButton = $('<div class="todo-col-btn"><button id="del-'+todo._id+'" class="delete">delete</button></div>');

    newTodo.addClass('task');
    newTaskNameDiv.on('click', changeEvent);
    newTaskNameDiv.on( { 'touchstart' : changeEvent } );
    //$('#whatever').on({ 'touchstart' : function(){ /* do something... */ } });
     if(todo.completed){
        newTaskNameDiv.addClass('done');
    }
    newTodo.append(newTaskNameDiv);

    deleteButton.on('click', deleteTask);
    if(todo.completed){
        newTodo.append(deleteButton);
    }
    
    return newTodo;
}


function changeEvent(evt) { 
    var id = evt.target.id;
    var todo = list.find(function(element) {
        return element._id ==  id;
    });
     event.stopPropagation();
    changeStatus(id, todo, evt.target);
}

function changeStatus(id, todo, target) {
    var url = '/api/todos/' + id;
    console.log('todo is ', todo);
    todo.completed = !todo.completed;
    var callback = function ( todo ) {
        changeElement(target, todo);
    }
    
    $.ajax({
      url: url,
      type: 'PUT',
      data: todo,
      success: callback
    });
}