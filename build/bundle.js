/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	var pdfDocument = void 0;
	var PAGE_HEIGHT = void 0;
	var DEFAULT_SCALE = 1.33;

	PDFJS.workerSrc = './pdf.worker.js';
	PDFJS.getDocument('Matthew_Kuzminski.pdf').then(function (pdf) {
	  pdfDocument = pdf;

	  var viewer = document.getElementById('viewer');
	  for (var i = 0; i < pdf.pdfInfo.numPages; i++) {
	    var page = createEmptyPage(i + 1);
	    viewer.appendChild(page);
	  }

	  loadPage(1).then(function (pdfPage) {
	    var viewport = pdfPage.getViewport(DEFAULT_SCALE);
	    PAGE_HEIGHT = viewport.height;
	    document.body.style.width = viewport.width + 'px';
	  });
	});

	window.addEventListener('scroll', handleWindowScroll);

	function createEmptyPage(num) {
	  var page = document.createElement('div');
	  var canvas = document.createElement('canvas');
	  var wrapper = document.createElement('div');
	  var textLayer = document.createElement('div');

	  page.className = 'page';
	  wrapper.className = 'canvasWrapper';
	  textLayer.className = 'textLayer';

	  page.setAttribute('id', 'pageContainer' + num);
	  page.setAttribute('data-loaded', 'false');
	  page.setAttribute('data-page-number', num);

	  canvas.setAttribute('id', 'page' + num);

	  page.appendChild(wrapper);
	  page.appendChild(textLayer);
	  wrapper.appendChild(canvas);

	  return page;
	}

	function loadPage(pageNum) {
	  return pdfDocument.getPage(pageNum).then(function (pdfPage) {
	    var page = document.getElementById('pageContainer' + pageNum);
	    var canvas = page.querySelector('canvas');
	    var wrapper = page.querySelector('.canvasWrapper');
	    var container = page.querySelector('.textLayer');
	    var canvasContext = canvas.getContext('2d');
	    var viewport = pdfPage.getViewport(DEFAULT_SCALE);

	    canvas.width = viewport.width * 2;
	    canvas.height = viewport.height * 2;
	    page.style.width = viewport.width + 'px';
	    page.style.height = viewport.height + 'px';
	    wrapper.style.width = viewport.width + 'px';
	    wrapper.style.height = viewport.height + 'px';
	    container.style.width = viewport.width + 'px';
	    container.style.height = viewport.height + 'px';

	    pdfPage.render({
	      canvasContext: canvasContext,
	      viewport: viewport
	    });

	    pdfPage.getTextContent().then(function (textContent) {
	      PDFJS.renderTextLayer({
	        textContent: textContent,
	        container: container,
	        viewport: viewport,
	        textDivs: []
	      });
	    });

	    page.setAttribute('data-loaded', 'true');

	    return pdfPage;
	  });
	}

	function handleWindowScroll() {
	  var visiblePageNum = Math.round(window.scrollY / PAGE_HEIGHT) + 1;
	  var visiblePage = document.querySelector('.page[data-page-number="' + visiblePageNum + '"][data-loaded="false"]');
	  if (visiblePage) {
	    setTimeout(function () {
	      loadPage(visiblePageNum);
	    });
	  }
	}

/***/ }
/******/ ]);