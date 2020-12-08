// Hamburger menu
let hamburger = document.querySelector(".hamburger");
let menu = document.querySelector(".mobile");

hamburger.addEventListener("click", function () {
  menu.classList.toggle("hide");
});

// Slider

// let sliderItem = document.getElementsByClassName("slider__content-item");
// let nextBtn = document.querySelector(".btn-next");
// let prevBtn = document.querySelector(".btn-prev");
// let slideNumber = document.querySelector(".slider__bottom-left span");
// let dotNumber = document.querySelectorAll(".dot");
// let dotBtn = document.querySelector("dot");

// let currentItem = 0;
// let $slideNum = 0;

// nextBtn.addEventListener("click", function () {
//   if (currentItem < sliderItem.length - 1) {
//     slideTo(currentItem + 1);
//   } else {
//     slideTo(0);
//   }
// });

// prevBtn.addEventListener("click", function () {
//   if (currentItem > 0) {
//     slideTo(currentItem - 1);
//   } else {
//     slideTo(sliderItem.length - 1);
//   }
// });

// dotNumber.forEach(function (e, i) {
//   e.addEventListener("click", function () {
//     slideTo(i);
//   });
// });

// function slideTo(num) {
//   sliderItem[currentItem].classList.remove("active");
//   sliderItem[num].classList.add("active");

//   dotNumber[currentItem].classList.remove("active");
//   dotNumber[num].classList.add("active");

//   currentItem = num;
//   slideNumber.innerText = (num + 1).toString().padStart(2, "0");
// }

// Video

let iframeVideo = document.querySelector("#video-iframe");

document.querySelectorAll(".play-btn").forEach((e) => {
  e.addEventListener("click", function (e) {
    let videoSrc = this.getAttribute("data-video-src");
    iframeVideo.src = "https://www.youtube.com/embed/" + videoSrc;
    // iframeVideo.setAttribute('src', iframeVideo.src);
    document.querySelector(".popup-video").style.display = "flex";
    // console.log(iframeVideo.src);
  });
});

document
  .querySelector(".popup-video .close")
  .addEventListener("click", function () {
    console.log("clicked");
    document.querySelector(".popup-video").style.display = "none";
    iframeVideo.src = "";
  });

// Scroll event


$(window).on("scroll", function () {
  let header = $("header .container-fluid");
  let $sliderSection = $(".slider").outerHeight();
  let scrollTop = $("html").scrollTop(); // Khoảng cách từ vị trí hiện tại đến top
    
  if (scrollTop > $sliderSection - header.outerHeight()) {
    header.css("background-color", "black");
  } else {
    header.css({ "background-color": "transparent", opacity: "0.8" });
  }
});

let $menu = $(".menu a");
let sections = [];

for(let i = 0; i < $menu.length; i++){
    let sectionName = $($menu[i]).attr('data-source');
    
    if($(sectionName).length){
        sections.push($(sectionName));
    }
}


$(window).on("scroll", function () {
    let scrollTop = $(window).scrollTop() + 200;
    sections.forEach(function(item, index){
        console.log(item);
        let topOfSection = item.position().top;
        let heightSection = item.outerHeight();
        // let headerSection = $("header .container-fluid").outerHeight();
        // console.log($menu[index])
        if(scrollTop > topOfSection && scrollTop < topOfSection + heightSection){
            $menu.removeClass('active-link');
            $($menu[index]).addClass('active-link');
        }
        
    })
    
});

$('.menu a').on('click',function(e){
    e.preventDefault();
    let idSection = $(this).attr('href');
    let top = $(idSection).position().top;

    $(window).scrollTop(top - $("header .container-fluid").outerHeight());
})

// Scroll to Top

$('.backToTop').on('click', function(){
    $(window).scrollTop(0);
})


// Carousel

var initPhotoSwipeFromDOM = function(gallerySelector) {
  var parseThumbnailElements = function(el) {
      var thumbElements = el.childNodes,
          numNodes = thumbElements.length,
          items = [],
          figureEl,
          linkEl,
          size,
          item;
      for(var i = 0; i < numNodes; i++) {
          figureEl = thumbElements[i]; // <figure> element
          if(figureEl.nodeType !== 1) {
              continue;
          }
          linkEl = figureEl.children[0]; // <a> element
          size = linkEl.getAttribute('data-size').split('x');
          item = {
              src: linkEl.getAttribute('href'),
              w: parseInt(size[0], 10),
              h: parseInt(size[1], 10)
          };
          if(figureEl.children.length > 1) {
              item.title = figureEl.children[1].innerHTML; 
          }
          if(linkEl.children.length > 0) {
              // <img> thumbnail element, retrieving thumbnail url
              item.msrc = linkEl.children[0].getAttribute('src');
          } 
          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
      }
      return items;
  };
  var closest = function closest(el, fn) {
      return el && ( fn(el) ? el : closest(el.parentNode, fn) );
  };
  var onThumbnailsClick = function(e) {
      e = e || window.event;
      e.preventDefault ? e.preventDefault() : e.returnValue = false;
      var eTarget = e.target || e.srcElement;
      var clickedListItem = closest(eTarget, function(el) {
          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
      });
      if(!clickedListItem) {
          return;
      }
      var clickedGallery = clickedListItem.parentNode,
          childNodes = clickedListItem.parentNode.childNodes,
          numChildNodes = childNodes.length,
          nodeIndex = 0,
          index;
      for (var i = 0; i < numChildNodes; i++) {
          if(childNodes[i].nodeType !== 1) { 
              continue; 
          }
          if(childNodes[i] === clickedListItem) {
              index = nodeIndex;
              break;
          }
          nodeIndex++;
      }
      if(index >= 0) {
          openPhotoSwipe( index, clickedGallery );
      }
      return false;
  };
  var photoswipeParseHash = function() {
      var hash = window.location.hash.substring(1),
      params = {};
      if(hash.length < 5) {
          return params;
      }
      var vars = hash.split('&');
      for (var i = 0; i < vars.length; i++) {
          if(!vars[i]) {
              continue;
          }
          var pair = vars[i].split('=');  
          if(pair.length < 2) {
              continue;
          }           
          params[pair[0]] = pair[1];
      }
      if(params.gid) {
          params.gid = parseInt(params.gid, 10);
      }
      return params;
  };
  var openPhotoSwipe = function(index, galleryElement, disableAnimation, fromURL) {
      var pswpElement = document.querySelectorAll('.pswp')[0],
          gallery,
          options,
          items;
      items = parseThumbnailElements(galleryElement);
      options = {
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),
          getThumbBoundsFn: function(index) {
              var thumbnail = items[index].el.getElementsByTagName('img')[0], // find thumbnail
                  pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
                  rect = thumbnail.getBoundingClientRect(); 

              return {x:rect.left, y:rect.top + pageYScroll, w:rect.width};
          },
          showAnimationDuration : 0,
          hideAnimationDuration : 0
      };
      if(fromURL) {
          if(options.galleryPIDs) {
              for(var j = 0; j < items.length; j++) {
                  if(items[j].pid == index) {
                      options.index = j;
                      break;
                  }
              }
          } else {
              options.index = parseInt(index, 10) - 1;
          }
      } else {
          options.index = parseInt(index, 10);
      }
      if( isNaN(options.index) ) {
          return;
      }
      if(disableAnimation) {
          options.showAnimationDuration = 0;
      }
      gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
      gallery.init();
  };
  var galleryElements = document.querySelectorAll( gallerySelector );
  for(var i = 0, l = galleryElements.length; i < l; i++) {
      galleryElements[i].setAttribute('data-pswp-uid', i+1);
      galleryElements[i].onclick = onThumbnailsClick;
  }
  var hashData = photoswipeParseHash();
  if(hashData.pid && hashData.gid) {
      openPhotoSwipe( hashData.pid ,  galleryElements[ hashData.gid - 1 ], true, true );
  }
};

$(window).load(function () {
  initPhotoSwipeFromDOM('.gallery__carousel');
  $('.carousel-bottom').flickity({
        // options
        cellAlign: 'left',
        contain: true,
        freeScroll: true,
        prevNextButtons: false,
        pageDots: false
  });
});

// Slider with Library

$('.slider__content').flickity({
  // options
//   cellAlign: 'right',
//   contain: true
prevNextButtons: false,
pageDots: false,
fade: true,
autoPlay: true

});

$('.btn-prev')

