$(document).ready(function(){
  $('.delete-thread').on('click', function(e){
    $target = $(e.target);
    const id = ($target.attr('data-id'));
    $.ajax({
      type:'DELETE',
      url: '/forums/'+id,
      success: function(response){
        alert('Deleting thread');
        window.location.href="/codesolutions/forums";
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
