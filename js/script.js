function sizeof(dict){
  var count = 0;
  for (var key in dict) {
    count++;
  }
  return count;
}

function nth(dict,n){
  var count = 0;
  for (var key in dict) {
    if(count === n){
      return {key:key, value:dict[key]};
    }
    count++;
  }
  return null;
}

function parseJSON(json){
  return $.parseJSON(json);
}

function loadRomList($,callback){
  var jsonFile = "./romlist.json";

  $.getJSON(jsonFile, function(data){
    callback(data);
  });

  // $.ajax({
  //   dataType: "json",
  //   url: jsonFile,
  //   data: {},
  //   successs: function(data){
  //     callback(data.responseText);
  //   },
  //   error: function(jqXHR, status){
  //     console.log("status: " + status);
  //     console.log("jqXHR: " + jqXHR);
  //   }
  // });

}

function chooseRom($, romList, callback){
  var $contents = $('#contents');
  var $parent = $('<div>');
  var $sel = $('<select id="choose-rom-select">');

  var count = 0;
  for (var key in romList) {
    var $opt = $('<option>');

    if(count == 0){
      $opt.attr('selected','selected');
    }

    $opt.text(key);
    $opt.attr('value',key);
    $sel.append($opt);

    count++;
  }
  $sel.append()

  $parent.append("<h3>Choose a rom</h3>");
  $parent.append($sel);
  $parent.append("<br><br><button id='choose-rom-submit'>OK</button>")
  $contents.html($parent);

  $("#choose-rom-submit").click(function(e){
    var $op = $("#choose-rom-select option:selected");
    if($op.length < 1){
      return false;
    }else{
      var key = $op.attr('value');
      $contents.html('');
      callback(romList[key]);
    }
  });
  // callback(nth(romList,0));
}

function showEmulator($){
  var dw = $(document).width();
  var dh = $(document).height();
  var w = (dw>640)? 640: dw;
  var h = (dh>480)? 480: dh;

  var $emu = $('<div>');
  $emu.attr('id','emulator');
  if(dw>800){
    $emu.css('width',w);
    $emu.css('height',h);
  }
  $emu.append("<p>To play this game, please, download the latest Flash player!</p>");
  $emu.append('<br>');

  var $a = $('<a href="http://www.adobe.com/go/getflashplayer">');
  $a.append('<img src="//www.adobe.com/images/shared/download_buttons/get_adobe_flash_player.png" alt="Get Adobe Flash player"/>');
  $emu.append($a);

  var $contents = $('#contents');
  $contents.html($emu);

  $("#buttons").removeAttr('hidden');

  $emu.tabIndex = 1234;
  $emu.focus();
}

function setFlashVars($,romPath,romType){
  function embed(){
    var $emulator = $('#emulator');

    if($emulator){
      var flashvars = {
          system : romType,
          url : './roms/' + romPath
      };

      var params = {};
      var attributes = {};

      params.allowscriptaccess = 'sameDomain';
      params.allowFullScreen = 'true';
      params.allowFullScreenInteractive = 'true';

      swfobject.embedSWF('flash/Nesbox.swf', 'emulator', '640', '480', '11.2.0', 'flash/expressInstall.swf', flashvars, params, attributes);
    }
  }

  embed();
}

$(function(){
  loadRomList($,function(json){
    var romList = json.roms;
    var rom = nth(romList,0);

    chooseRom($, romList, function(rom){
      // console.log(rom);
      showEmulator($);

      setFlashVars($, rom.rom, rom.type);
      // setFlashVars($, romPath, romType);
    });
  });
});
