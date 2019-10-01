$(function() {

	var songlist;
	var myAudio = document.getElementById("myAudio");
	var url = 'https://music.163.com/song/media/outer/url?id=';
	var songStar = 0;
	var songEnd = 20;
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



		if ($("#myAudio").data("id") == id) {
			console.log("同一首");
			playPause();
			return;
		}



		$(".duration").text("00:00");
		$(".currenTime").text("00:00");

		$("#myAudio").data("id", id);
		$("#myAudio").attr("src", url + id);
		var imgUrl;
		for (let i of songsDetail) {
			if (i.id == id) {
				imgUrl = i.al.picUrl;
			}
		}
		// console.log("dddddddddd", $(".img-box").children());

		$.ajax({
			type: 'GET',
			url: 'http://www.arthurdon.top:3000/lyric?id=' + id,
			success: function(data) {
				console.log(data)
				$(".lyric>ul").html(" ")
				var lyric = data.lrc.lyric;
				lyric = lyric.split("\n");
				
				lyric.pop();
				
				let frag = document.createDocumentFragment();
				for (let i of lyric) {
					let gc = i.split("]");
					let text = gc[1];
					let time = gc[0].slice(1).split(":");
					let scecond = parseInt(time[0] * 60) + parseFloat(time[1]);
					let li = $(`<li data-time = "${scecond}">${text}</li>`);
					frag.appendChild(li[0]);
				}
				$(".lyric>ul").append(frag)
			},
			error:function(){
				let li = $("<li class='ac'>暂无歌词~</li>")
				$(".lyric>ul").html(li)
			}
		})



		console.log($(this))
		$(".img-box").css("backgroundImage", "url(" + imgUrl + ")");
		$(".show-img .photo").css("backgroundImage", "url(" + imgUrl + ")");

		$(".mask").css("left", 0 + "px");
		$(".activate").css("width", 0 + "px");
		$(".play-pause").children().attr("src", "./img/播放.png")

		$("#myAudio")[0].oncanplay = function() {
			$("#myAudio")[0].play();
			$(".play-pause").children().attr("src", "./img/暂停.png")
			$("#myAudio").data("staus", 1);
			var self = this;
			$(".duration").text(caltime(self.duration));

		}

	}


	// 	$("#myAudio")[0].oncanplay = function() {
	// 		//console.log("currenttime",this.currentTime)
	// 
	// 	}




	var songsId = [];
	var songsDetail = [];
	var songs = localStorage.getItem('songs');
	if (songs) {

		songs = JSON.parse(songs);
		songsDetail = songs.playlist.tracks.concat();
		$(".hot-song>span").text(songsDetail.length);
		console.log(songs);
		for (var i = 0; i < songs.privileges.length; i++) {
			songsId.push(songs.privileges[i].id);
		}
	} else {
		$.ajax({
			type: 'GET',
			url: 'http://www.arthurdon.top:3000/top/list?idx=1',
			async: false,
			success: function(data) {

				console.log('data ==> ');
				//songsdata = data;
				localStorage.setItem('songs', JSON.stringify(data))

				songsDetail = data.playlist.tracks.concat();
				$(".hot-song>span").text(songsDetail.length);
				//保存歌曲id
				for (var i = 0; i < data.privileges.length; i++) {
					songsId.push(data.privileges[i].id);
				}
			},
			error: function(data) {
				console.log("失败");
				songsdata = beifen;
				localStorage.setItem('songs', JSON.stringify(beifen));
				songsDetail = beifen.playlist.tracks.concat();
				$(".hot-song>span").text(songsDetail.length);
				console.log(songsDetail);
			}
		})
	}




	function addSong(data, songStar, songEnd) {


		var ul = document.createDocumentFragment();
		for (var i = songStar; i < songEnd; i++) {
			var sg = [];
			for (var j = 0; j < data[i].ar.length; j++) {
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
				$(".playSong").removeClass("playSong");
				$(this).addClass("playSong");
				$(".myrate>li").removeClass("activate1");
				$(".myrate>li").eq(1).addClass("activate1");
			})
			li = li[0]
			ul.appendChild(li);

		}
		$(".songlist>ul").append(ul);
		songStar = songEnd;
		songEnd += 20;
		console.log(songStar, songEnd)
	}

	console.log(songsDetail)
	addSong(songsDetail, songStar, songEnd);
	songStar = songEnd;
	songEnd += 20;


	var maxLeft = $(".layer").width() - $(".mask").width();

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

	$("#myAudio")[0].onended = function() {
		console.log("结束")

		if ($(".mymode")[0].dataset.mode == "loop") {
			console.log("dddd")
			this.currentTime = 0;
			return;
		}
		nextSong();
	}
	

	$("#myAudio")[0].ontimeupdate = function() {
		// console.log("测试========？");
		var timers = [];
		var self = this;
		var wordsBoxTop = parseFloat($('.lyric>ul').css('top'));
		var timer = setTimeout(function() {

				for (var i = 0; i < timers.length - 1; i++) {
					clearTimeout(timers[i]);
				}

				//$(".duration").text(caltime(self.duration));
				$(".currenTime").text(caltime(self.currentTime));

				if ($(self).data("touch")) {


				var proportion = self.currentTime / self.duration;
				var left = maxLeft * proportion;
				left = left >= maxLeft ? maxLeft : left <= 0 ? 0 : left;
				$(".mask").css("left", left + "px");
				$(".activate").css("width", left + $(".mask").width() / 2 + "px");
			
				//移动歌词
				let $lyr = $(".lyric>ul>li");
				
				for(var i = 0;i<$lyr.length;i++){
					let nowtime = $($lyr[i]).data("time");
					let nexttime = $($lyr[i+1]).data("time");
					
					let currentTime = self.currentTime;
					
					
					if(currentTime>=nowtime && nexttime>currentTime){
						$(".lyric>ul>li.ac").removeClass("ac");
						$($lyr[i]).addClass("ac");
						
						$('.lyric>ul').animate({
						    top: "-"+50 * i + 'px'
						},160);
					}
				}
			
			}


		}, 200);

		timers.push(timer);




	}

	function playPause() {
		if ($("#myAudio").data("staus")) {
			//1表示正在播放,切换暂停


			$("#myAudio")[0].pause();
			$(".play-pause").children().attr("src", "./img/播放.png");
			$("#myAudio").data("staus", 0);
		} else {
			$("#myAudio")[0].play();
			$(".play-pause").children().attr("src", "./img/暂停.png")
			$("#myAudio").data("staus", 1);
		}
	}

	//播放暂停
	$(".play-pause>img").on("click", function() {
		
		var a = $(".play-pause");
		if(a.data("first")){
			a.data("first",0);
			RadomSong();
			
			return;
		}
		playPause();
		

	})


	// img-box

// 	function showimgtog() {
// 		
// 
// 		
// 	}
// 
	$(".img-box").on("click", function() {

		//showimgtog()
		
		var a = $(".show-img").data("show");
		
		
		if (a == 0) {
			console.log("a------0")
			$(".show-img").data("show", 1);
			$(".top-nav .back").show();
			$(".show-img").show();
			
			$(".songlist").hide();
			$(".songlist").data("show",0);
			
		} else {
			console.log("a------1")
			$(".show-img").data("show", 0);
			$(".lyric").hide();
			$(".show-img").hide();
		}

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

	function nextSong() {
		//ordinal random loop;
		let mode = $(".mymode")[0];

		if (mode.dataset.mode == "ordinal" || mode.dataset.mode == "loop") {

			if ($(".playSong").index() == ($(".songlist>ul>li").length - 1)) {
				console.log("//")
				var a = $(".songlist>ul>li").first();
				$(".playSong").removeClass("playSong")
			} else {
				var a = $(".playSong").removeClass("playSong").next();
			}


			let new_id = a.data("id");
			changeMusic(new_id);
			//$("#myAudio").data("id",new_id);
			a.addClass("playSong");
			console.log(mode.dataset.mode)
		} else if (mode.dataset.mode == "random") {
			
			
			RadomSong();
			
		

		}
	}

	function RadomSong(){
		lastSong = $("#myAudio").data("id");
		let lis = $(".songlist>ul>li");
		let next_song = $(lis[Math.floor(Math.random() * lis.length)]);
		let n_id = next_song.data("id")
		$(".playSong").removeClass("playSong");
		next_song.addClass("playSong");
		changeMusic(n_id);
		//$("#myAudio").data("id",n_id);
	}

	function prevSong() {
		//ordinal random loop;
		let mode = $(".mymode")[0];

		if (mode.dataset.mode == "ordinal" || mode.dataset.mode == "loop") {

			if ($(".playSong").index() == 0) {
				
				var a = $(".songlist>ul>li").last();
				$(".playSong").removeClass("playSong")
			} else {
				var a = $(".playSong").removeClass("playSong").prev();
			}

			let new_id = a.data("id");
			changeMusic(new_id);
			//$("#myAudio").data("id",new_id);
			a.addClass("playSong");
			console.log(mode.dataset.mode)
		} else if (mode.dataset.mode == "random") {
			let lis = $(".songlist>ul>li");
			let next_song = $(lis[Math.floor(Math.random() * lis.length)]);
			let n_id = next_song.data("id")
			$(".playSong").removeClass("playSong");
			next_song.addClass("playSong");
			changeMusic(n_id);
			//$("#myAudio").data("id",n_id);

		}
	}

	$(".next>img").on("click", function() {
		var a = $(".play-pause");
		if(a.data("first")){
			a.data("first",0);
			RadomSong();
			return;
		}
		nextSong()
	})

	$(".previous>img").on("click", function() {
		var a = $(".play-pause");
		if(a.data("first")){
			a.data("first",0);
			RadomSong();
			return;
		}
		prevSong();
	})

	//mode切换
	$(".mymode").on("click", function() {

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
		var a = $(this).find(".activate1").removeClass("activate1").index()
		if (a == 3) {
			a = 0;
		} else {
			a += 1;
		}
		var rate = $(this).find("li").eq(a).addClass("activate1").data("rate");
		console.log(rate)
		myAudio.playbackRate = rate;
	})

	//歌曲懒加载
	var timers = [];

	$(".songlist").on("scroll", function() {

		var b = $(".songlist>ul").height();
		var a = $(".songlist").height();
		var c = $(".songlist").scrollTop();

		var timer = setTimeout(function() {
			for (let i = 0; i < timers.length - 1; i++) {
				clearTimeout(timers[i]);
			}

			if (a + c + 50 > b) {
				console.log("time===========")
				addSong(songsDetail, songStar, songEnd);
				songStar = songEnd;
				songEnd += 20;
			}

			timers = [];
		}, 800)

		timers.push(timer);


	})









	//查看热门歌曲
	$(".hot-song").on('click', function() {
		$(".songlist").show();
		$(".songlist").data("show",1);
		//$(".song-t").hide()
		$(".top-nav .back").show();
		$(".show-img").data("show", 0);
		$(".top-nav .back").show();
		$(".show-img").hide();
		
	})

	$(".top-nav .back").on('click', function() {
		if($(".songlist").data("show")){
			console.log("=====================歌曲切换")
			$(".songlist").hide();
			$(".songlist").data("show",0);
		}else if($(".show-img").data("show")){
			$(".show-img").hide();
			$(".lyric").hide();
			console.log("=====================歌词切换")
			$(".songlist").data("show",0);
		}
	});

	$(".show-img").on("click", function() {
		$(".lyric").show();
		$(".show-img").hide();
	})
	$(".lyric").on("click", function() {
		$(".lyric").hide();
		$(".show-img").show();
	})


})
