$(function() {

	var songlist;
	var myAudio = document.getElementById("myAudio");
	var url = 'https://music.163.com/song/media/outer/url?id=';
	//var url = 'https://music.163.com/song/media/outer/url?id=1381755293'
	//计算时间
	function caltime(time) {
		var min = parseInt(time / 60);
		var sec = parseInt(time % 60);
		min = min < 10 ? "0" + min : min;
		sec = sec < 10 ? "0" + sec : sec;
		return min + ":" + sec;
	}


	//切换歌曲
	function changeMusic(id) {
		$(".duration").text("00:00");
		$(".currenTime").text("00:00");


		$("#myAudio").attr("src", url+id);
		var imgUrl;
		for(let i of songsDetail){
			if(i.id==id){
				imgUrl = i.al.picUrl;
			}
		}
		// console.log("dddddddddd", $(".img-box").children());
		
		
		console.log($(this))
		$(".img-box").css("backgroundImage", "url(" + imgUrl + ")");
		$(".show-img .photo").css("backgroundImage", "url(" +imgUrl + ")");
		$("#myAudio")[0].oncanplay = function() {
			$("#myAudio")[0].play();
			$(".play-pause").children().attr("src", "./img/暂停.png")
			$("#myAudio").data("staus", 1);
			console.log("///////");

		}

	}

	$("#myAudio")[0].oncanplay = function() {
		//console.log("currenttime",this.currentTime)

	}

	
	var songsId = [];
	var songsDetail = [];
	var songs = localStorage.getItem('songs');
	if(songs){
		
		songs = JSON.parse(songs);
		songsDetail = songs.playlist.tracks.concat();
		console.log(songs);
		for(var i = 0 ;i<songs.privileges.length;i++){
			songsId.push(songs.privileges[i].id);
		}
	}else{
		$.ajax({
		    type: 'GET',
		    url: 'http://www.arthurdon.top:3000/top/list?idx=1',
			async:false,
		    success: function (data) {
				
		        console.log('data ==> ');
				//songsdata = data;
		        localStorage.setItem('songs', JSON.stringify(data))
		
		        songsDetail = data.playlist.tracks.concat();
		
		        //保存歌曲id
		        for (var i = 0; i < data.privileges.length; i++) {
		            songsId.push(data.privileges[i].id);
		        }
		    },
			error :function(data){
				console.log("失败")
				songsdata = beifen;
				localStorage.setItem('songs', JSON.stringify(beifen));
				songsDetail = beifen.playlist.tracks.concat();
				console.log(songsDetail)
			}
		})	
	}
	
	var songStar = 0;
	var songEnd = 20;
	
	
	function addSong(data,songStar,songEnd) {
				
				var ul = $("<ul></ul>");
				for (var i = songStar; i < songEnd; i++) {
					var sg = [];
					for(var j = 0 ;j<data[i].ar.length;j++){
						sg.push(data[i].ar[j].name);
					}
					//console.log(data[i].al.pirUrl)
					var li = $(
						`<li data-id = "${data[i].id}"><div class="song-img"><img src="${data[i].al.picUrl}" class="auto-img"/></div>
						<div class="song">${data[i].name}</div><div class="singer">${sg.join("/")}</div></li>`
					);
					li.on("click", function() {
						var id = $(this).data("id");
						console.log(id)
						changeMusic(id);
						$(".myrate>li").removeClass("activate");
						$(".myrate>li").eq(1).addClass("activate");
					})
					ul.append(li);
				}
				$(".songlist").append(ul);
			}
			
	console.log(songsDetail)
	addSong(songsDetail,songStar,songEnd);
	

	var maxLeft = $(".layer").width();

	function removeMask(e) {
		var clientX = e.touches[0].clientX;
		var progress_left = $(".progress").position().left;

		var left = clientX - $(".mask").width() / 2 - progress_left;
		left = left >= maxLeft ? maxLeft : left <= 0 ? 0 : left;
		$(".mask").css("left", left + "px");
		$(".activate").css("width", left + $(".mask").width() / 2 + "px");
	}


	//进度条
	$(".layer").on("touchstart", function(e) {
		removeMask.call(this, e);
		var left = $(".mask").position().left;
		var proportion = left / maxLeft;
		$("#myAudio")[0].currentTime = $("#myAudio")[0].duration * proportion;


		if (!($("#myAudio").data("staus"))) {
			console.log("play")
			$("#myAudio")[0].play();
			$(".play-pause").children().attr("src", "./img/暂停.png")
			$("#myAudio").data("staus", 1);
		}
	});
	$(".layer").on('touchmove', function(e) {
		$("#myAudio").data("touch", false);
		removeMask.call(this, e);
	});
	$(".layer").on("touchend", function() {
		$("#myAudio").data("touch", true);
		var left = $(".mask").position().left;
		var proportion = left / maxLeft;
		$("#myAudio")[0].currentTime = $("#myAudio")[0].duration * proportion;

	})



	$("#myAudio")[0].ontimeupdate = function() {
		// console.log("测试========？");
		var timers = [];
		var self = this;
		var timer = setTimeout(function() {

			for (var i = 0; i < timers.length - 1; i++) {
				clearTimeout(timers[i]);
			}

			$(".duration").text(caltime(self.duration));
			$(".currenTime").text(caltime(self.currentTime));

			if ($(self).data("touch")) {


				var proportion = self.currentTime / self.duration;
				var left = maxLeft * proportion;
				left = left >= maxLeft ? maxLeft : left <= 0 ? 0 : left;
				$(".mask").css("left", left + "px");
				$(".activate").css("width", left + $(".mask").width() / 2 + "px");
			}


		}, 200);

		timers.push(timer);




	}

	//播放暂停
	$(".play-pause").on("click", function() {
		if ($("#myAudio").data("staus")) {
			//1表示正在播放,切换暂停


			$("#myAudio")[0].pause();
			$(this).children().attr("src", "./img/播放.png");
			$("#myAudio").data("staus", 0);
		} else {
			$("#myAudio")[0].play();
			$(this).children().attr("src", "./img/暂停.png")
			$("#myAudio").data("staus", 1);
		}
	})


	// img-box

	$(".img-box").on("click", function() {

		$(".show-img").toggle();


	})

	//收藏
	$(".heart").on("click", function() {

		if (this.dataset.heart == 0) {
			$(this).attr("src", "./img/redheart.png");
			this.dataset.heart = 1;
		} else {
			$(this).attr("src", "./img/heart.png");
			this.dataset.heart = 0;
		}


	})



	//mode切换
	$(".mymode").on("click", function() {
		console.log();
		if (this.dataset.mode == "ordinal") {
			$(this).css({
				backgroundImage: "url(./img/suijibofang.png)"
			})

			this.dataset.mode = "random";
		} else if (this.dataset.mode == "random") {
			$(this).css({
				backgroundImage: "url(./img/danquxunhuan.png)"
			})

			this.dataset.mode = "loop";
		} else if (this.dataset.mode == "loop") {
			$(this).css({
				backgroundImage: "url(./img/shunxubofang.png)"
			})

			this.dataset.mode = "ordinal";
		}
	})

	$(".myrate").on("click", function() {
		var a = $(this).find(".activate").removeClass("activate").index()
		if (a == 3) {
			a = 0;
		} else {
			a += 1;
		}
		var rate = $(this).find("li").eq(a).addClass("activate").data("rate");
		console.log(rate)
		myAudio.playbackRate = rate;
	})
})
