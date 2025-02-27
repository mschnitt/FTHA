ws_fade = function (options){
	var $ = jQuery;
	options.duration = options.duration || 1000;
	
	var Images = [];
	var curIdx = 0;
	
	this.init = function(aCont){
		Images = $('img', aCont).get();
		$(Images).each(function(Index){
			if (!Index) $(this).show()
			else $(this).hide();
		})
	}
	this.go = function(new_index){
		$(Images).each(function(Index){
			if (Index == new_index) $(this).fadeIn(options.duration);
			if (Index == curIdx) $(this).fadeOut(options.duration);
		});
		curIdx = new_index;
		
		return true;
	}
}
/** WowSlider version 1.1 
 * Created by WowSlider.com
 * Modified 15:20 15.03.2011
 * Using structure
 * <div id=wowslider-container>
 *	<div class=ws_images>
 *		<a id=wows0><img src="..."/></a>...
 *	</div>
 *	<div class=ws_bullets>
 *		<a href="#wows0"></a>...
 *	</div>
 *	<div class=ws_shadow></div>
 * </div>
 */
jQuery.fn.wowSlider = function(options){
	var $this = this;
	var $=jQuery;
	options = $.extend({
		effect:function(options){ // ws_fade
			var images;
			
			this.init = function(aCont){
				images = aCont.find('img');
				images.each(function(Index){
					if (!Index) $(this).show()
					else $(this).hide();
				})
			}
			this.go = function(new_index,curIdx){
				$(images.get(new_index)).fadeIn(options.duration);
				$(images.get(curIdx)).fadeOut(options.duration);
				
				return true;
			}
		},
		prev:"", 
		next:"", 
		duration:1000, 
		delay:20*100, 
		outWidth:960,
		outHeight:360,
		width:960,
		height:360,
		caption: true, 
		controls:true,
		autoPlay:true,
		bullets:true,
		onStep: function(){},
		stopOnHover:0
	}, options);
	
	var $Elements = $this.find('.ws_images A');
	var images = $Elements.find('IMG');

	// store text and remove from element to fix white gap in google chrome
	$Elements.each(function(index){
		var inner = $(this).html()||""; 
		var pos = inner.indexOf('>', inner);
		if (pos>=0){
			$(this).data('descr', inner.substr(pos+1));
			if (pos<inner.length-1) $(this).html(inner.substr(0,pos+1));
		};
		$(this).css({'font-size': 0});
	});
	
	
	var elementsCount = $Elements.length; // init first because effect may added self elements
	var frame = $('A.ws_frame',$this).get(0);
	
	
	// init engine function
	var curIdx = 0;
	function go(index){
		if (curIdx == index) return;
		
		// try run effect
		var current = effect.go(index, curIdx);
		if (!current) return;
		if (typeof current != 'object') current = $Elements[index];
		
		curIdx = index;
		go2(index);
		if (options.caption) setTitle(current);
		
		options.onStep(curIdx);
	};
	
	
	function go2(index){
		if (options.bullets) setBullet(index);
		if (frame) frame.setAttribute('href', $Elements.get(index).href);
	}
	
	// autoplay
	var autoPlayTimer;
	function restartPlay(){
		stopPlay();
		
		if (options.autoPlay)
			autoPlayTimer = setTimeout(function(){
					go(curIdx<elementsCount-1? curIdx+1: 0);
					restartPlay();
				}, 
				options.delay + options.duration
			);
	};
	function stopPlay(){
		if (autoPlayTimer) clearTimeout(autoPlayTimer);
		autoPlayTimer = null;
	};
	
	function forceGo(event, index){
		stopPlay();
		event.preventDefault();
		go(index)
		restartPlay();		
	}
	
	
	$Elements.find('IMG').css('position','absolute');
	
	// init effect
	if (typeof options.effect=='string') options.effect = window["ws_" + options.effect];
	
	var effect = new options.effect(options,$this);
	effect.init($('.ws_images',$this));
	$Elements.find('IMG').css('visibility','visible');

	
	// ---- reg
	// check and create overlay contaner
	var ic = c = $('.ws_images',$this);
	var t="";
	c = t? $('<div></div>'):0;
	if (c) {
		c.css({
			position:'absolute',
			right:'2px',
			bottom:'2px',
			padding:'0 0 0 0'
		});
		ic.append(c);
	};

	// for IE use iframe
	if (c && document.all){
		var f = $('<iframe src="javascript:false"></iframe>');
		f.css({
			position:'absolute',
			left:0,
			top:0,
			width:'100%',
			height:'100%',
			filter:'alpha(opacity=0)'
		});
		
		f.attr({
			scrolling:"no",
			framespacing:0,
			border:0,
			frameBorder:"no"
		});
		
		c.append(f);
	};
	
	var d = c? $(document.createElement("A")):c;
	if(d){
		d.css({
			position:'relative',
			display:'block',
			'background-color':'#E4EFEB',
			color:'#837F80',
			'font-family':'Lucida Grande,sans-serif',
			'font-size':'11px',
			'font-weight':'normal',
			'font-style':'normal',
			'-moz-border-radius':'5px',
			'border-radius':'5px',
			padding:'1px 5px',
			width:'auto',
			height:'auto',
			margin:'0 0 0 0',
			outline:'none'
		});
		d.attr({href:'ht'+'tp://' + t.toLowerCase()});
		d.html(t);
		d.bind('contextmenu', function(eventObject){
			return false;
		});
		
		c.append(d);
	}
	// ---- reg
	
	// add arrows
	if (options.controls){
		var $next_photo = $('<a href="#" class="ws_next">'+options.next+'</a>');
		var $prev_photo = $('<a href="#" class="ws_prev">'+options.prev+'</a>');
		$this.append($next_photo);
		$this.append($prev_photo);
	
		/**
		* when hovering each one of the images, 
		* we show the button to navigate through them
		*
		$this.live('mouseenter',function(){
			$next_photo.show();
			$prev_photo.show();
		}).live('mouseleave',function(){
			$next_photo.hide();
			$prev_photo.hide();
		});*/
		
		$next_photo.bind('click', function (e){ forceGo(e, curIdx<elementsCount-1? curIdx+1: 0) });
		$prev_photo.bind('click', function (e){ forceGo(e, curIdx>0? curIdx-1: elementsCount - 1) });
	};
	
	
	// bullets & tooltip
	function initBullets(){
		$bullets_cont = $this.find('.ws_bullets>div');
		$bullets = $('a', $bullets_cont);
		$bullets.click(function(e){ forceGo(e, $(e.target).index()) });

		
		// Tooltip's
		$thumbs = $bullets.find('IMG');
		if ($thumbs.length){
			// create tooltip frame
			var mainFrame = $('<div class="ws_bulframe"/>').appendTo($bullets_cont);	// main frame
			var imgContainer = $('<div/>').css({width: $thumbs.length + 1+'00%'}).appendTo($('<div/>').appendTo(mainFrame));	// images container
			$thumbs.appendTo(imgContainer);		// move image to new image container
			$('<span/>').appendTo(mainFrame);	// triangle
			
			// move to the bullet
			var curIndex=-1;
			function moveTooltip(index){
				if (index<0) index=0;
				
				$($bullets.get(curIndex)).removeClass('ws_overbull');
				$($bullets.get(index)).addClass('ws_overbull');
				
				mainFrame.show();
				var mainCSS = { left: $bullets.get(index).offsetLeft - mainFrame.width()/2 };
				var contCSS = { left:-$thumbs.get(index).offsetLeft };
				if (curIndex<0){
					mainFrame.css(mainCSS);
					imgContainer.css(contCSS);
				}
				else{
					if (!document.all) mainCSS.opacity = 1;
					mainFrame.stop().animate(mainCSS, 'fast');
					imgContainer.stop().animate(contCSS, 'fast');
				}
				
				curIndex = index;
			}
			
			$bullets.hover(function(){ moveTooltip($(this).index()) });

			// show/hide
			var hideTime;
			$bullets_cont.hover(
				function(){
					if (hideTime) { clearTimeout(hideTime); hideTime=0 };
					moveTooltip(curIndex) 
				},
				function(){
					$bullets.removeClass('ws_overbull');
					if (document.all){
						if (!hideTime) hideTime = setTimeout(function(){ 
							mainFrame.hide();
							hideTime=0; 
						},400);
					}
					else
						mainFrame.stop().animate(
							{ opacity: 0 }, 
							{ duration: 'fast', complete: function(){mainFrame.hide()} }
						);
				}
			);
			$bullets_cont.click(function(e){ forceGo(e, $(e.target).index()) });
		}
	}

	function setBullet(new_index){
		$(".ws_bullets A", $this).each(function(index){
			if (index == new_index)
				$(this).addClass("ws_selbull")
			else
				$(this).removeClass("ws_selbull");
		})
	}
	
	
	// create title bar
	if (options.caption){
		$caption = $("<div class='ws-title' style='display:none'></div>");
		$this.append($caption);
		$caption.bind('mouseover', function(e){ stopPlay() });
		$caption.bind('mouseout', function(e){ restartPlay() });
	}
	
	function setTitle(A){
		var title = $('img', A).attr("title");
		var descr = $(A).data('descr');
		
		var $Title = $('.ws-title', $this);
		$Title.hide();
		if (title||descr){
			$Title.html((title? '<span>'+title+'</span>': '') + (descr? '<div>'+descr+'</div>': ''));
			$Title.fadeIn(400,function(){if($.browser.msie) $(this).get(0).style.removeAttribute('filter') });//css({opacity: 0}).animate({opacity: 'show'}, 400);
		}
	}
	
	// init
	if (options.bullets) initBullets();
	go2(0);
	if (options.caption) setTitle($Elements[0]);
	if (options.stopOnHover){
		this.bind('mouseover', function(e){ stopPlay() });
		this.bind('mouseout', function(e){ restartPlay() });
	}
	restartPlay();
	
	return this;
};
// init main object
// jQuery(document).ready - conflicted with some scripts
// Transition time = 2.4s = 32/10
// SlideShow delay = 6.5s = 20/10
jQuery('#wowslider-container1').wowSlider({
	effect:"fade", 
	prev:"prev", 
	next:"next", 
	duration: 20*100, 
	delay:32*100, 
	outWidth:809,
	outHeight:302,
	width:809,
	height:302,
	caption: false, 
	controls:true,
	autoPlay:true,
	bullets:0,
	stopOnHover:true
})

