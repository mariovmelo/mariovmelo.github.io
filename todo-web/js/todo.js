/*
  ------------------------------
	
	Simple To-do
 	Developed by Caue Queiroz

 	Goals: 
 	Create a todo list that can be able to:
 	- Add new tasks
 	- List added tasks
 	- Complete a task
 	- Remove a task
 	- Store everything on localStorage

  ------------------------------
*/
(function() {
	var urlBase = "https://todo-service-imd.herokuapp.com";
	var app = {
		init: function() {
			// Load list
			app.populate();

			// Add task
			document.querySelector('.app-insert input#tarefa').addEventListener('keyup', function(e) {
				if ( e.which === 13 && this.value !== '' ) {
					var $date = document.querySelector('#data');
					item = {descricao:this.value,dataLimite:$date.value,feito:false};
					app.addTask(item);
					this.value = '';
					$date.value = '';
				}
			}, false);

			document.querySelector('.app-list').addEventListener('click', function(e) {
				// Remove task
				if ( e.target.classList.contains('remove-task') ) {
					console.log(e.target.parentNode)
					app.removeTask(e.target);

				// Complete Task
				} else if ( e.target.classList.contains('task') ) {
					app.completeTask(e.target);
				}
			}, false);
		},
		addTask: function (tarefa) {
			$.ajax({
				url: urlBase+"/tarefa",
				crossDomain: true,
				data: JSON.stringify(tarefa),
				dataType: 'json',
				success: function(item) {
					//console.log(item);
					//app.createItem(item);
					app.populate();
				},
				type: 'POST',
				contentType:"application/json"
			});
		},
		removeTask: function (task) {
			task.style.opacity = 0;
			$.ajax({
				url: urlBase+"/tarefa/"+task.id,
				crossDomain: true,
				dataType: 'json',
				success: function(item) {
					//console.log(item);
					task.parentNode.remove();
					app.populate();
				},
				type: 'DELETE',
				contentType:"application/json"
			});
			
		},
		completeTask: function (task) {
			console.log(task);
			var elemento = task.getElementsByTagName("a")[0];

			console.log();
			$.ajax({
				url: urlBase+"/tarefa/"+elemento.id
			  }).done(function(tarefa) {
				tarefa.feito=!tarefa.feito;
				$.ajax({
					url: urlBase+"/tarefa",
					crossDomain: true,
					data: JSON.stringify(tarefa),
					dataType: 'json',
					success: function(item) {
						task.classList.toggle('task-complete');
					},
					method: 'PUT',
					contentType:"application/json"
				});

			  });
		},
		populate: function(){
			var $list = document.querySelector('.app-list ul');
			$list.innerHTML='';

			$.ajax({
				url: urlBase+"/tarefa"
			  }).done(function(data) {
				for (var item in data) {
					//console.log(data[item]);
					app.createItem(data[item]);
				}
				
			  });

		},
		createItem: function(item){
			var $list = document.querySelector('.app-list ul');
			var new_task = document.createElement('li');
			new_task.setAttribute('class', 'task');

			if(item.feito){
				new_task.classList.toggle('task-complete');
			}
			
			new_task.innerHTML = item.descricao+' - '+item.dataLimite + '<a href="javascript:;" id="'+item.id+'" class="remove-task">remove</a>';
			$list.appendChild(new_task);
		}
	};
	app.init();

})();
