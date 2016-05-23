function postCreateStream(streamName, cbSuccess, cbFailure) {
  var data = { name: streamName };

  $.post({

    url: "api/streams/create",
    data: JSON.stringify(data),
    contentType: 'application/json',
    success: function(resData) {
      if (cbSuccess) {
        cbSuccess(resData);
      }
    },
    error: function(error) {
      if (cbFailure) {
        cbFailure(error);
      }
    }
  });

  field.val('');
  return;
}
