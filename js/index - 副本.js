let provinceName = '';
const detailBegin = 'map-detail-';
let tuolingAudio = null;
let tuolingAudioPlaying = false;
const tuolingAudioId = 'tuolingAudio';
$(function() {

	//监听浏览器窗口变化事件
	$(window).resize(function() {
		setIframe();
		//	initMainBody();
	});

	//监听地图点击事件
	$("body").on("click", '.map .map-list .map-image', function() {
		provinceName = $(this).attr('data-province');
		changeProvinceName(provinceName);

		// $('.info-list .info-item-content').hide();
		// $('.info-list .info-item-content').eq(0).show();
	});

	$("body").on("click", '.map .map-detail-mapBox .back-btn', function() {
		changeProvinceName('');
	});
	//监听页面滚动事件
	$(window).scroll(function() {
		setScroll()
	});

	$("body").on("click", '.mulu .mulu-item', function() {
		$('.mulu .mulu-item').removeClass('mulu-item-active');
		$(this).addClass('mulu-item-active');
		let id = $(this).attr('data-top-id');
		if (id == undefined) return;
		let mapBoxTop = 0;
		if (id !== 'shouye') {
			mapBoxTop = $("#" + id).offset().top;
		}
		let windowTop = $(window).scrollTop();
		let shengyu = mapBoxTop - windowTop;
		if (shengyu < 0) shengyu = -1 * shengyu;
		let miaoshu = parseInt(shengyu / 10000) + 0.5;
		if (shengyu > 1000 && miaoshu < 1) {
			miaoshu = 1;
		}
		console.log(miaoshu)
		$("html, body").animate({
			scrollTop: mapBoxTop
		}, miaoshu * 1000); // 亲测有效


	});

	tuolingAudio = document.getElementById(tuolingAudioId);
	tuolingAudio.addEventListener('play', function() {
		tuolingAudioPlaying = true;
	});
	tuolingAudio.addEventListener('ended', function() {
		//tuolingAudioPlaying = false;
	});
	//页面刷新时候滚动条不在顶部，因此需要初始化位置
	setScroll();
	setIframe();
	// initMainBody();
});

function changeProvinceName(thisProvinceName) {
	provinceName = thisProvinceName;
	console.log(provinceName)
	if (provinceName === '') {
		$(".map-detail-mapBox").hide();
		// $(".map-list-box").show();
		//$(".map-box").height('unset');
		$('#map').removeClass('map-top-fixed');
		$('#map').removeClass('map-bottm-fixed');
		
		$('html').css('overflow','unset');
		
	} else {
		$('html').css('overflow','hidden');
		// $(".map-list-box").hide();
		const className = detailBegin + provinceName
		$(".map-detail").hide();
		$('.' + className).css('display', 'flex');
		$(".map-detail-mapBox").show();
		let mapBoxTop = $(".map-box").offset().top;
		$(window).scrollTop(mapBoxTop);

		let haveItem = $('.' + className + ' .info-list .info-list-content div').length;

		let html = '<p class="dian-item dian-active"></p>';
		for (let i = 1; i < haveItem; i++) {
			html += '<p class="dian-item"></p>';
		}
		$(".map-detail-mapBox .info-list-content-dian .info-list-content-dian-box").html(html);
	}
}

//根据滚动条高度 设置显示信息
function setScroll() {
	let windowHeight = $(window).height();
	let windowTop = $(window).scrollTop();
	let houjiTop = $(".houji").offset().top;
	if (windowTop > houjiTop - windowHeight) {
		$("body").css('background-image', 'url(./imgs/houji.jpg)')
	} else if (windowTop > 1080) {
		$("body").css('background-image', 'url(./imgs/big_pic1.png)')
	} else {
		$("body").css('background-image', 'url(./imgs/big_pic.png)')
	}

	let tuolingAudioTop = $("#tuolingAudioPlayBox").offset().top;
	console.log(tuolingAudioTop);
	if (tuolingAudioTop - windowTop - windowHeight < 0) {
		//处理音频播放
		if (!tuolingAudioPlaying) {
			playAudio();
		}
	}

	//视频处理
	let videoTop = $("#video").offset().top;
	let videoHeight = $("#video").height();
	let ssss = videoTop - windowTop;
	let video = document.getElementById("video"); // 获取视频元素
	if (ssss - windowHeight < 0 && ssss > 0) {
		video.play(); // 调用pause()方法暂停视频播放
	} else {
		video.pause(); // 调用pause()方法暂停视频播放
	}


	let muer_mount_videoTop = $("#muer_mount_video").offset().top;
	let muer_mount_videoHeight = $("#muer_mount_video").height();
	let s2 = muer_mount_videoTop - windowTop;
	let muer_mount_video = document.getElementById("muer_mount_video"); // 获取视频元素
	if (s2 - windowHeight < 0 && s2 > 0) {
		muer_mount_video.play(); // 调用pause()方法暂停视频播放
	} else {
		muer_mount_video.pause(); // 调用pause()方法暂停视频播放
	}






	//地图滚动效果处理

	let mapBoxTop = $(".map-box").offset().top;
	let mapBoxHeight = $(".map-box").height();
	let mapHeight = $('#map').height();
	let height = windowTop - mapBoxTop;
	// console.log(mapBoxTop);
	// console.log(mapBoxHeight);




	if (provinceName !== '') {
		let zonggaodu = mapBoxTop + mapBoxHeight; //底部距离顶部的总高度，当滚动高度大于该值说明整个地图以显示完毕
		let shengyugaodu = zonggaodu - windowTop;
		let mapBoxTopTo = mapBoxTop - windowTop; //距离顶部高度
		// console.log('总高度', zonggaodu)
		// console.log('剩余高度', shengyugaodu)
		// console.log('当前距离顶部', mapBoxTopTo)
		// console.log('顶部', mapBoxTopTo < 0 && shengyugaodu > mapHeight)

		const className = detailBegin + provinceName
		let cH = $('.' + className + ' .info-list .info-list-content').height();
		let cH2 = $('.' + className + ' .info-list').height();
		let huadongjulu2 = cH + cH2;
		if (mapBoxTopTo < 0 && shengyugaodu > mapHeight) {
			$('#map').addClass('map-top-fixed');
			$('#map').removeClass('map-bottm-fixed')
			//处理展示第几条数据

			// let l = $('.' + className + ' .info-list .info-item-content').length;
			//const itemHeight = mapBoxHeight / l;
			//let showItemIndex = 0;

			console.log('滚动内容区域高度', cH);
			if (cH > 0) {
				// let showItemIndex = (height / itemHeight);
				// showItemIndex = showItemIndex.toFixed(0);
				// $('.info-list .info-item-content').not(showItemIndex).hide();
				// $('.info-list .info-item-content').eq(showItemIndex).show();

				let huadongjulu1 = mapBoxHeight - mapHeight;
				let yihuadong1 = windowTop - mapBoxTop;

				let bili = yihuadong1 / huadongjulu1;
				let sssH = huadongjulu2 * bili
				// console.log(sssH);
				// console.log(shengyugaodu);
				// console.log(mapBoxHeight);
				// console.log(bili);
				$('.' + className + ' .info-list').scrollTop(sssH);

				let dianLeng = $(".map-detail-mapBox .info-list-content-dian .info-list-content-dian-box p").length;
				let active = Math.ceil(dianLeng * bili);
				console.log(active)
				$(".map-detail-mapBox .info-list-content-dian .info-list-content-dian-box p").removeClass('dian-active')
				for(let i=0;i<active;i++){
					$(".map-detail-mapBox .info-list-content-dian .info-list-content-dian-box p").eq(i).addClass('dian-active')
				}
			}
		} else if (mapBoxTopTo < 0 && shengyugaodu < mapHeight) {
			$('#map').addClass('map-bottm-fixed')
			$('#map').removeClass('map-top-fixed');
			$('.' + className + ' .info-list').scrollTop(huadongjulu2);
		} else {
			$('#map').removeClass('map-top-fixed');
			$('#map').removeClass('map-bottm-fixed');
			$('.' + className + ' .info-list').scrollTop(0);
		
		}
			console.log('顶部距离',mapBoxTopTo)
		if(mapBoxTopTo <-1*mapBoxHeight){
			changeProvinceName('');
		}
	}
}

function playAudio() {

	tuolingAudio.currentTime = 0; // 将播放位置重置为0
	tuolingAudio.loop = false;
	tuolingAudio.play(); // 播放音频
}

function setIframe() {
	$("iframe").each(function(index, e) {
		let bili = $(e).attr('data-bili');
		if (bili != undefined) {
			bili = parseFloat(bili);
			let width = $(e).width();
			let height = width / bili;
			$(e).height(height)
		}
	});
}