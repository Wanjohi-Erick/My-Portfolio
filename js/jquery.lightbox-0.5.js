/**
 * jQuery lightBox plugin
 * This jQuery plugin was inspired and based on Lightbox 2 by Lokesh Dhakar (http://www.huddletogether.com/projects/lightbox2/)
 * and adapted to me for use like a plugin from jQuery.
 * @name jquery-lightbox-0.5.js
 * @author Leandro Vieira Pinho - http://leandrovieira.com
 * @version 0.5
 * @date April 11, 2008
 * @category jQuery plugin
 * @copyright (c) 2008 Leandro Vieira Pinho (leandrovieira.com)
 * @license CC Attribution-No Derivative Works 2.5 Brazil - http://creativecommons.org/licenses/by-nd/2.5/br/deed.en_US
 * @example Visit http://leandrovieira.com/projects/jquery/lightbox/ for more informations about this jQuery plugin
 */

// Offering a Custom Alias suport - More info: http://docs.jquery.com/Plugins/Authoring#Custom_Alias
(function($) {
	/**
	 * $ is an alias to jQuery object
	 *
	 */
	$.fn.lightBox = function(settings) {
		// Settings to configure the jQuery lightBox plugin how you like
		settings = jQuery.extend({
			// Configuration related to overlay
			overlayBgColor: 		'#fff',		// (string) Background color to overlay; inform a hexadecimal value like: #RRGGBB. Where RR, GG, and BB are the hexadecimal values for the red, green, and blue values of the color.
			overlayOpacity:			0,		// (integer) Opacity value to overlay; inform: 0.X. Where X are number from 0 to 9
			// Configuration related to navigation
			fixedNavigation:		false,		// (boolean) Boolean that informs if the navigation (next and prev button) will be fixed or not in the interface.
			// Configuration related to images
			imageLoading:			'images/lightbox-ico-loading.gif',		// (string) Path and the name of the loading icon
			imageBtnPrev:			'images/lightbox-btn-prev.gif',			// (string) Path and the name of the prev button image
			imageBtnNext:			'images/lightbox-btn-next.gif',			// (string) Path and the name of the next button image
			imageBtnClose:			'images/lightbox-btn-close.gif',		// (string) Path and the name of the close btn
			imageBlank:				'images/lightbox-blank.gif',			// (string) Path and the name of a blank image (one pixel)
			// Configuration related to container image box
			containerBorderSize:	10,			// (integer) If you adjust the padding in the CSS for the container, #lightbox-container-image-box, you will need to update this value
			containerResizeSpeed:	400,		// (integer) Specify the resize duration of container image. These number are miliseconds. 400 is default.
			// Configuration related to texts in caption. For example: Image 2 of 8. You can alter either "Image" and "of" texts.
			txtImage:				'Image',	// (string) Specify text "Image"
			txtOf:					'of',		// (string) Specify text "of"
			// Configuration related to keyboard navigation
			keyToClose:				'c',		// (string) (c = close) Letter to close the jQuery lightBox interface. Beyond this letter, the letter X and the SCAPE key is used to.
			keyToPrev:				'p',		// (string) (p = previous) Letter to show the previous image
			keyToNext:				'n',		// (string) (n = next) Letter to show the next image.
			// Don´t alter these variables in any way
			imageArray:				[],
			activeImage:			0
		},settings);
		// Caching the jQuery object with all elements matched
		var jQueryMatchedObj = this; // This, in this context, refer to jQuery object
		/**
		 * Initializing the plugin calling the start function
		 *
		 * @return boolean false
		 */
		function _initialize() {
			_start(this,jQueryMatchedObj); // This, in this context, refer to object (link) which the user have clicked
			return false; // Avoid the browser following the link
		}
		/**
		 * Start the jQuery lightBox plugin
		 *
		 * @param object objClicked The object (link) whick the user have clicked
		 * @param object jQueryMatchedObj The jQuery object with all elements matched
		 */
		function _start(objClicked,jQueryMatchedObj) {
			// Hime some elements to avoid conflict with overlay in IE. These elements appear above the overlay.
			$('embed, object, select').css({ 'visibility' : 'hidden' });
			// Call the function to create the markup structure; style some elements; assign events in some elements.
			_set_interface();
			// Unset total images in imageArray
			settings.imageArray.length = 0;
			// Unset image active information
			settings.activeImage = 0;
			// We have an image set? Or just an image? Let´s see it.
			if ( jQueryMatchedObj.length == 1 ) {
				settings.imageArray.push(new Array(objClicked.getAttribute('href'),objClicked.getAttribute('title')));
			} else {
				// Add an Array (as many as we have), with href and title atributes, inside the Array that storage the images references		
				for ( var i = 0; i < jQueryMatchedObj.length; i++ ) {
					settings.imageArray.push(new Array(jQueryMatchedObj[i].getAttribute('href'),jQueryMatchedObj[i].getAttribute('title')));
				}
			}
			while ( settings.imageArray[settings.activeImage][0] != objClicked.getAttribute('href') ) {
				settings.activeImage++;
			}
			// Call the function that prepares image exibition
			_set_image_to_view();
		}
		/**
		 * Create the jQuery lightBox plugin interface
		 *
		 * The HTML markup will be like that:
			<div id="jquery-overlay"></div>
			<div id="jquery-lightbox">
				<div id="lightbox-container-image-box">
					<div id="lightbox-container-image">
						<img src="../fotos/XX.jpg" id="lightbox-image">
						<div id="lightbox-nav">
							<a href="#" id="lightbox-nav-btnPrev"></a>
							<a href="#" id="lightbox-nav-btnNext"></a>
						</div>
						<div id="lightbox-loading">
							<a href="#" id="lightbox-loading-link">
								<img src="../images/lightbox-ico-loading.gif">
							</a>
						</div>
					</div>
				</div>
				<div id="lightbox-container-image-data-box">
					<div id="lightbox-container-image-data">
						<div id="lightbox-image-details">
							<span id="lightbox-image-details-caption"></span>
							<span id="lightbox-image-details-currentNumber"></span>
						</div>
						<div id="lightbox-secNav">
							<a href="#" id="lightbox-secNav-btnClose">
								<img src="../images/lightbox-btn-close.gif">
							</a>
						</div>
					</div>
				</div>
			</div>
		 *
		 */
		function _set_interface() {
			// Apply the HTML markup into body tag
			$('body').append('<div id="jquery-overlay"></div><div id="jquery-lightbox"><div id="lightbox-container-image-box"><div id="lightbox-container-image"><img id="lightbox-image"><div style="" id="lightbox-nav"><a href="#" id="lightbox-nav-btnPrev"></a><a href="#" id="lightbox-nav-btnNext"></a></div><div id="lightbox-loading"><a href="#" id="lightbox-loading-link"><img src="' + settings.imageLoading + '"></a></div></div></div><div id="lightbox-container-image-data-box"><div id="lightbox-container-image-data"><div id="lightbox-image-details"><span id="lightbox-image-details-caption"></span><span id="lightbox-image-details-currentNumber"></span></div><div id="lightbox-secNav"><a href="#" id="lightbox-secNav-btnClose"><img src="' + settings.imageBtnClose + '"></a></div></div></div></div>');	
			// Get page sizes
			var arrPageSizes = ___getPageSize();
			// Style overlay and show it
			$('#jquery-overlay').css({
				backgroundColor:	settings.overlayBgColor,
				opacity:			settings.overlayOpacity,
				width:				arrPageSizes[0],
				height:				arrPageSizes[1]
			}).fadeIn();
			// Get page scroll
			var arrPageScroll = ___getPageScroll();
			// Calculate top and left offset for the jquery-lightbox div object and show it
			$('#jquery-lightbox').css({
				top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
				left:	arrPageScroll[0]
			}).show();
			// Assigning click events in elements to close overlay
			$('#jquery-overlay,#jquery-lightbox').click(function() {
				_finish();									
			});
			// Assign the _finish function to lightbox-loading-link and lightbox-secNav-btnClose objects
			$('#lightbox-loading-link,#lightbox-secNav-btnClose').click(function() {
				_finish();
				return false;
			});
			// If window was resized, calculate the new overlay dimensions
			$(window).resize(function() {
				// Get page sizes
				var arrPageSizes = ___getPageSize();
				// Style overlay and show it
				$('#jquery-overlay').css({
					width:		arrPageSizes[0],
					height:		arrPageSizes[1]
				});
				// Get page scroll
				var arrPageScroll = ___getPageScroll();
				// Calculate top and left offset for the jquery-lightbox div object and show it
				$('#jquery-lightbox').css({
					top:	arrPageScroll[1] + (arrPageSizes[3] / 10),
					left:	arrPageScroll[0]
				});
			});
		}
		/**
		 * Prepares image exibition; doing a image´s preloader to calculate it´s size
		 *
		 */
		function _set_image_to_view() { // show the loading
			// Show the loading
			$('#lightbox-loading').show();
			if ( settings.fixedNavigation ) {
				$('#lightbox-image,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			} else {
				// Hide some elements
				$('#lightbox-image,#lightbox-nav,#lightbox-nav-btnPrev,#lightbox-nav-btnNext,#lightbox-container-image-data-box,#lightbox-image-details-currentNumber').hide();
			}
			// Image preload process
			var objImagePreloader = new Image();
			objImagePreloader.onload = function() {
				$('#lightbox-image').attr('src',settings.imageArray[settings.activeImage][0]);
				// Perfomance an effect in the image container resizing it
				_resize_container_image_box(objImagePreloader.width,objImagePreloader.height);
				//	clear onLoad, IE behaves irratically with animated gifs otherwise
				objImagePreloader.onload=function(){};
			};
			objImagePreloader.src = settings.imageArray[settings.activeImage][0];
		};
		/**
		 * Perfomance an effect in the image container resizing it
		 *
		 * @param integer intImageWidth The image´s width that will be showed
		 * @param integer intImageHeight The image´s height that will be showed
		 */
		function _resize_container_image_box(intImageWidth,intImageHeight) {
			// Get current width and height
			var intCurrentWidth = $('#lightbox-container-image-box').width();
			var intCurrentHeight = $('#lightbox-container-image-box').height();
			// Get the width and height of the selected image plus the padding
			var intWidth = (intImageWidth + (settings.containerBorderSize * 2)); // Plus the image´s width and the left and right padding value
			var intHeight = (intImageHeight + (settings.containerBorderSize * 2)); // Plus the image´s height and the left and right padding value
			// Diferences
			var intDiffW = intCurrentWidth - intWidth;
			var intDiffH = intCurrentHeight - intHeight;
			// Perfomance the effect
			$('#lightbox-container-image-box').animate({ width: intWidth, height: intHeight },settings.containerResizeSpeed,function() { _show_image(); });
			if ( ( intDiffW == 0 ) && ( intDiffH == 0 ) ) {
				if ( $.browser.msie ) {
					___pause(250);
				} else {
					___pause(100);	
				}
			} 
			$('#lightbox-container-image-data-box').css({ width: intImageWidth });
			$('#lightbox-nav-btnPrev,#lightbox-nav-btnNext').css({ height: intImageHeight + (settings.containerBorderSize * 2) });
		};
		/**
		 * Show the prepared image
		 *
		 */
		function _show_image() {
			$('#lightbox-loading').hide();
			$('#lightbox-image').fadeIn(function() {
				_show_image_data();
				_set_navigation();
			});
			_preload_neighbor_images();
		};
		/**
		 * Show the image information
		 *
		 */
		function _show_image_data() {
			$('#lightbox-container-image-data-box').slideDown('fast');
			$('#lightbox-image-details-caption').hide();
			if ( settings.imageArray[settings.activeImage][1] ) {
				$('#lightbox-image-details-caption').html(settings.imageArray[settings.activeImage][1]).show();
			}
			// If we have a image set, display 'Image X of X'
			if ( settings.imageArray.length > 1 ) {
				$('#lightbox-image-details-currentNumber').html(settings.txtImage + ' ' + ( settings.activeImage + 1 ) + ' ' + settings.txtOf + ' ' + settings.imageArray.length).show();
			}		
		}
		/**
		 * Display the button navigations
		 *
		 */
		function _set_navigation() {
			$('#lightbox-nav').show();¨W6Ò9¼ñƒ+Q#0h8æÉC]Ã€Ñ] Ó"A»¯À§@¿	(ÿ	´ñõàÿ8ğÍÍºõÆ86¾“ìÎ ¯oŸ\>»ñöÃvŞˆr,Óÿ•-³xõ}é>»2¹ôAZ#@«›AÛLÈçÀâ8Ø;0¦¤€×7Á®x	mõßáàŞŠïƒí3Øù½z[[cõôöLğ§Æƒ@;]öi}Ÿ ø÷EôB;½	;éô„lç@>RÑ¾&àÉ,Ø‡ï@ş¦@ŞÇ·P‡#À²…°ò KÁG½a¯ö o‡¬dÇ?G¼Ï!wÓÀ‡^ô;@æ‡7b€Å5ã÷`™¶úVàÀ¨ó@äqú¡¿àÀ·HëmÅ¿7^ÃÓ/Q†[awìÇ8W.ä²m ˜»ûmàoä~?êœôO£|í€·+[U¨¶oDëïïWü{#– 3/Uüët@;a#˜ù)èr%ôÀsùĞ¾oÂ6ƒ9ó+€QëÁO¯ÇfOzwƒÑÌ€ÿ­hïÏĞ?ÍDœ	ÀÌjğGOèØ—‘VÚ÷¯h³‡A#ü?F{+àÕÙº1ê `ºv¾Ä{°m»@U ŸùĞ§)À¬›A÷£Ğ½ïãù]”í2ä»¼[¾Üƒò¹ÎE»§CÿÛñoäÈäÚîäûô‰vfU0èıøôI`Ñ)`ÊûĞ½» ›S WwÁöÚŞ_‰¼|X “cÀç-ùß¥C.?€İ>¸ºå[¥[»ö#ø+]‡»ûàg v>ODZIÀàxÔW;‹f'êr9øh‡n\3òhÔ­ƒ0#Ÿzè‡«ÑÓÎ¢‹BY‹!ãc`{~üîÿÎ‚©ÙfàÆ¨ÿtè¿C'd#ÉŠo[oİ¼·¶nã`|Êù0±#ä¿6¶·"	íR9<şã¨Ï.à‚í¾ôŸ~[ƒ:¾Œ~˜Òú ıé İ\lOğ¨¾\><ü¨CzÃ€Ñ£ÏÀì™_‰r¬‡¾Êî}£€;Qà¯Í …v®ÑyĞèVØm¯£¬û@ãzäÙ	úæØÚ™ã!cÚ>ã.ÀíÀÈÅûí>ıâRĞûgĞ¤äâsØÑ•º5ûÑÎßã›ÑfÇ‘î§Ğ9¯€—şÛñïsŒGwLÁxØ\à“¶ÿh>øëôş‚vyOñ¯wƒœøvÖ€¢ ´½QÃ[‡Á—ÀMG_i:xï2èÙû ïÕ(Ã9Ä×şÒa{<‰1œãÀãO¡íËhŒMjç,5‚VèÖÜ	»êağ×m±À¸kàv sî@ÿ
»óĞF;ëÔ„<÷¢_=eş4éÛ*ı®Ã°%ãQ@¿èÏoPüûa·¡¬¡À¤tè¢Däİ¤İypÂî¨PüçÕ­Uüg‚.€N;{kªâ?·al¨[€; O“ÿÙ
o£Í&£—[6ÏB™^B{®†½wD‡#KÑOxí³:¯	öà_€·}Ğ·ü|ü8ì¥/€o _— ği°ë:ÔïĞİŒ¶ø¹T·fa7èp9ør%ôî9¤s3tÉ|ØŞ{Á“'Q8Å¿'¦ÊäL[S9
ıë«€«WÃÆHD9NƒOÏï_¿«•ñ~ÈC6lÿN ù­ÿÃ?Ñÿ]¹8™XŞ¼íSU„øGO£Ñ>€U&è³
`Ëd´õ-x¿<ZE[®°2³qİÀòŞÙ„-¸A7?qvXwÈŞrğö6àĞOÀõ<Å¿–ùZğM/|÷úpÚ¸óà‘µŠ¯ÈxàÂıÈÿğêŸ!·gñ|vÑŒÉüˆ±‚]Š_ñå ÇlÅ¿ÇïE´G0èöêº²ÑöêU û Ù3°•öu=†xßëÆ.Î¡4í¼	eî¬ø×ã•(ş3EFœ[ĞNe°}´==tô¼\§¿£Ìkt²ö4êt0¢ yvG[?‰v¾õÿÚ»ó«¶}àËPDµE(dê”¡¶hp›’¤4™Â–á–º…¨¡dHŠ„	D‘©;Dq*D¨¤2DR¥×Óó^ßëz}ÿ~Ø¯½÷çskçqçq®k]kmĞ—[hÀ¸ò§Ô\™âî»I-LçNRŸÖÁ+ŒÓ¶aóóœ·oÄu€ÑıBòÎâgÆMFá›*´`^9å~,ŸfÓ®‡iÊ?áz|åwÜPU›víÌvÅàõ8;MÔ&8ÿ^1Ğ7.—Oã3¯j°šK[°árëéÎ£äû;à=Gêí|úf¢ïWÓÕ*·kzB>:*Nãûˆq{ØØ
'Y0w%Æõ	Ú„äİ§Uğ¸—4’‡÷‹›qÍ§âk)şyRÎI—œ+Ö×·ëC²VK]uÍZ¸yç?Ï‹ñõ­6ßC>pÍú}+œ…ÊyNÔ¾[ûüN<©-ÅpEv/’wË/;Øñ2¾¸Ïıæ‹Î4èËì·Ì÷Åıı_Z¨=ÿÔcÇ8Æ1ŒËëoÜ¡»Xk)gí¦ãû2½Ùîrş¾§ñŒc¿ûÕ`£ñÆßãÜğ,¸™jœsí&ÇñjëX6¯ƒsnW»?É–Òò‡ıÿ¬1†øé|9âº”-öâ¤Vt×\uQ|wñ16ÜFë®ÓŸÉâgï’5jâ¸ßèÑ¶8µ+Œšµœ¸è.§Ğ¶l¸8®ù–<Ø”şÌîšåÙ©[Lón…‹ÕCõä«¢gøïïÜŞ5•×2ÄP†z¡ëÀ~Õå”Áâ-;N˜+V®ÇYmåæõ°__üˆ2a,®‘u…klÆc9ù­Š1¡ù!YOµ”ón“{ÂÇÙ°ñ—š uj¬¿	>Éî˜bî¬åÅe«áº?•[>şS[æ‰Ñá´cw¼R‡M~±c¸éMx{LnoH‹Ü™š¯S­o u:â‡ßÄsK<Ó5ªÃø
<×P¡>Œë³,ç‹|øƒ1İÜú[Eİš=²‡dÔ+´a;®üÍ¸FYvÙ)GmáëZ|Ğ!$k!læãÇéñÙlw>éDÅñ•¨K±Yµë…¸ğ<×œÅç²áĞ¬i0HËâ±Ôı#hÓ½Æ2¾ö;¾Gó§¶×tî>Ç| q<r¹>®¿?$s÷°Çœù²~]"ßÖ×Ör]k¹i¡X,á™Pw¸‰k™W†ç;ù{³ö¾óM?íYzVvÂ±·òY\hš<İù¯4[„…e~÷LÍ7h(.çÂÀ#°^VùŠf™%V¬nÿ²3YŠWsĞ#9éb*î¨#.÷«uà†ëá£ŸïöÒmÔ–Ró«ú/zïÕ‡“²òrC5^vz)ÖôÏâÅ¼¸æ ¾‰ûD=kÿÖÏçqáºb#Şk$§lÑ¿¸>æP6.7âXı^:º=v±¶œ-ÎFÉ7¹ÕãùğSö(F?¢³pKYZª‰8ÏÄ)eù¡96s-xáWº¿ÿå'µ;êŞxhÌÄõx¶8¶±º6â:®[[×Wi»•øá=íZèÚS{.ûMW×‘¿†ä]Äj“!!Ù·«6Î—9aq<]ù…ûVÂÓ™øó×ËnÛùdPHÖì›¥}eùj&­ü†±ÀØóZ¿Ïf‡Éä„¶Ê/—Cç±yE˜h¤Ÿ9ÅÁÙüSBì–äÏôû ÜWCm5^;Ÿá¿¿1¸™mâúßUåUjÏ6tÛcåäïñ[®eÿwÄòtùñØZâÔ°ŞŞ/t|Qy)¿k¾í¾qÜı
œ± õÜú¾(¢Ş^.G~gOjÛSÚóø–osí¶ğ=Ø5öÑ™q§·Äa%:¦™ù”.=`Œ©-N¨‰Ë«‰‘Jê«µj’Âl•ªi>ö}iñyX}’uBÓïHÇ1±ÅtÜêò»i‚‰85'.úQ®úQüì
Éœöø¡7}ÖI·RÉáúq^dÜ÷éF¹*Ã½ÆhÃÉ”î)Éfw„dsQ±ßİ÷[ùe4Ÿ¼êyAIm­&ÆOª5Ö:·<Ğ/ÈŞGàºm”?âØàj×hï˜Wø4îÙò/µË‘”ÿÆ²cn>yƒ=Ãß~¨–KŸ‰wÓe}İóEœßgnÔş–òØl¸¼–®ëŞãüÌ‘ç£=c}Qˆ}–³Å0}ş6$û½¼¯}qşéÎ—Ëïøê1\EÎZ,'•õY–<ú={ßŸÒVq|¶§8ûDmÙß£•
ú»´<úº¼^„Ïït­ønmëÔü†·hñ8¡$®œ’ı»rÓÓÕÂ¿¯?	?óé>©ñ¹:4@–vÔôùfRÁ˜W|×î*œ¸Ä=_“¯—;¶©v=¦&íâúãäób0Ÿ§®Äyôû*ú3®{9v‡ãÙy8s+¾ÿ(>^ÀmKØâ,:=ÖËäõêÍò¸â”¾<ç_»ŞÍÎo’½%gÉ%SÅt	ù©¼ÜV	ÏÄ½cîáÃ[åÖ¸æB7øËÁƒØ©œşª	3!Yãÿ {e°ùŸÇÜï³¬İ˜Ã'Ó¾·û]?${d,	Éû'µñ×zoŠØX€¿ŸÂ)ËØæ&l¿\¡İİõ­)UÂ—Å´ıúôûtá‡#ì<UœNĞŸ‚°ğ±¸)/Åñ†»ñûnş®Ë‡yÎğßÿ{æt/Œ_ğumùì^-G÷À“eğ@gÇı—ËióÅŞùlÿ9]ĞÅï¢ââ>×¸Cİ2,Ã»ûéÿ6x5?ÖÕÎYî÷›{Ç?¯¹nÜÛ±n*Ç5°ªÀâ)xoã÷3íHöÔæ>ÆO^wÌ	8üA. $ûAåÜñ÷fJv§¯®ö]W|R†ÆºŸ–KÍß¹‡Vû˜>,Á®Oéc&Û®óÓ?$ï“U7WĞµ³Bòàµ166ñ}sv‰kÙ_áü!ì}ƒûD=û~($ëÌe§‘újèGÜgô"úÿGüyÜ1mRÏ¾OÒ¡uéKÕÓ¿ÊU¥è¹üÓM²ÜgxHŞ·À¿g'ÄWå£¸¦A7\“¥¾ÉÒ¯øø!Ú9îÓŞXMM¹xÚPßÖˆ³KhÂÊxsƒ|1ÆjÉØ¹‚6-•×Oñßûrÿ[°°R¥_&KØËWÿ¤SÛá¿¿õEµ\%qW‡|B«,Çƒß³áììµ0"$k‡ÌfógØ7¾#Ç¿ã{ú™bâF±>ÌyÏâÒ‰r]|¾Ú&º8$s@ç«‘Âññ)>.L„½®â³ñê™Ú·‹ëiÌpı×a<î}]T?«áöâ8d´óÎÒ×·?4¦³ŠFí£†«¯{èß%¸;>{í‘ªéo¿†d¸ønÍSj˜xÍopÿÛ4fÜó«.8'$ûşœĞşv!Y#ºRêyá ùğvÚùõ¬õnHŞşšM‡…ä½ÅY¸kƒëpìWøâ2}ËÇ‹¦Æö;¨3WÂA\[¾)_ÿŠ£c-·’^;è~Cş¿¦[HÖYí+÷Æ=R²¹ßõü?ÎzÉGóhë!´t¦a¸Úx,fêóKtí¬Ô8dçÜ‚Ó¦ÏÙGÃ_$&–á½BÚr>}ß÷ˆã‘ñYIKŸ7§{û.¾g·.5ì[mØÎî†do•Ó™ÿğÕ^<ò5?Öa×¸÷î.¶›£W‰ÁKùdKHŞã³ˆÁ›ïËÍáûjyo‰sø²ãÉúxñÚ¬÷ş\ø	-ô\HöÎÿ„ã¸~ê^ü]Æy;ÅB²Ïv\çt¼¬Éz“}hßÔ;‡ÅÎj±õˆš£,ß!ŸôÆs9c-qŞÏğ!Fú²iµÔxÿCê§ÿÒÂyÙ5®ß§}Ëñwû¬‹k çÿ–7¾ÀÕã¾!™oşeHÖØMB²–ÓXZ³9¿®T£}D÷Æ½‡ûˆñiì÷lœc¼Q[‹ÑD;øª9<|§=3Ù,¾ë˜;5Oi;Ö‘óÃÅ@\Ş‚Í7Ái'yo!N8.÷ÿ’ÒfËñ{\aŒ=·Ûäã0õ8›ıÊ÷»>*Nâ<…©1’^üõŒüyR»{:¦ö}Èşñ¹äAøÏ÷ÖhÇZ×{RÏ§'¯Âá¹Şl•?5¾RóÿıíÃ-ütöLƒù¸ğ¹ì+ÿ®sòÃÙbi¡Ú)®¿ò+ÍPÏÅõîîÄ7›áù"5c&ì¬w­¸Vê*ñçŞ—SÇ”÷KØ) sCåô—´¿N8bd¬Ÿ]â°»8n.'×‡cp;J
Ám7u\{q7—¶iB«|+Î–Ò:yÜÿeù÷>Ü×˜Ş©ŸUÄóTñ°?5.øo:lœ6WKÍCŠs=vë×‡Æ£ÖŸ!bèC×ìÄ¾Ùè¿KhŸ[õ)Îy‰k|6g£¸Îòl÷©*Ÿœä«ı¸n".ïkÔşã!y¤66ÉŞOÈQû}özHöpúFvÈÇéù5â~'ï†šÀE[|÷=?—=«Ÿ›ÃÑòÕyrç³l÷>ˆ{–×»BòNå•âf¸é­6=’9”m´÷¹³+nÌË¿ïÁo‹ìïôÕö–îEHŞ‹ú $ó¯õ»NHö¹+£/Íı¿[¾l¡İ·Ÿá¿¿µÖŸj­pû1¿Ï/õùöA<ğ1=TÁiípß7âí˜ã»i’8vT'${2şÇ=ã<¥‚¸r*.‹ë$¼¨öY«‡qĞk!Ùgøx¨A7Ä5 3i‹a´fÎ©ES”CóÁÚ58ó%øşR›Ÿƒ—Ò[C²şÁğßïÛ›zNß5m†s‹ÑÃ¿I\UUş"â»kSCòşòkì~6ÎG¹7.Öæ¸vİÃîy¿b£æ®÷­—š°„o&…dÔÿÀÄ&÷œn\¶?­”=$ï|’¹¿q?£®S†¿—'N°÷vı»×õ€ÏÆxgEHöÄÍF?²áp×Úäº«ä†1¾û‹şà‹›éõÀ^9õ£ºcºV^cUàóQ*ÃoÍÔíôÿ	qñ=ÛŸ›O¸A?ŸÉÜò©´æ:Ü¶C,f—±i\Gí]m{Çı@.ç‹-úñ˜ÿ×°ç)6XÅÇmÏğßßxJß…gş£Ëğ{ŒÙËåÊçC²^~–:1ÎOÎt­Nâ'Û?Š7&áŒ®]Ù3äÉê‹Y8æIÇçóüb”vlTŸ´ÃÉ{C2/ÿ[ÇÆ½VGK›MW´ ÑêÃÔ¥Î)®¶Í#•\ï˜ŸğTOó‹Éåøx³ü|™ºbEjLº+<ÆµKï1&¶][G²ùdñğ~¸M;Îwşm>Ÿ¨.#fâº²ÏòWM<ó•X›’ı”~§>£çâóÒ¸W~1ûEjşÇ`öª€¯¡wÓ7_âèÚø¤©{ß¥H¯–g‹ßÚbü˜˜\’wˆó{ÅuÜk¼„üù}ß%l’õZcŸÙrù:í|FûfºFÜ³e;ÿ6?“Ûßä÷\8$_HŞ©É¯Ï{Ù±ªcÇĞjÅå÷Éøñ>Ü÷‹ûè´å¯ğS],Œà»ñôıu¾ÿ=YNÇÁ\~÷x_®óÙ¤ÔzÜóäCùº:étç¿ÇÄX3¶^+=a9®½6æÂëğ÷k"íãƒŸñÌ×òkÛÌnÂŸóø¦»ñ‘ûù¦¼¶ôÇŸeÅDÜ»§²ØıUì.şFiß+î—G[ï‡÷Ü!y­;‰ïuUÆIGRó`â>åpıfqû'ş\„›?'7Ñ07Ãîd¼ß9Å>œó0.¬J¯Æú¬GHÖ&¾,$sš7©1ŸµiÀOóØ8»ßÕñY1ñßÇg„_ğá'âä	çOoÒgğäry°x6¹Ôó—¶4ş÷âôR|ô"üÄµµ»êÃL?WûÖËŸ½Ùh%ıç-v•[óË­÷ñÃ2X)CvàÓq0’ÃwÓqUùp+~!®]ÁëC²§õ-¸¾·”n›«c, •vµ`‹ò°q‚6¯ŠÛª±m14S[óòWIÜß85OlUHÖùı}NıÜÇŞ?O±]\s8®5Ö[ÃÔéÎ·ã¦cbd_ÎJé½axl£ã'ÓóRX(Â7gãËåüy?^‰ûš¿DÇÌ	Éßp@6c)×ºw?^À™Cp×¸ß§Æ8NëÔ€çª)Íxø(BåÉ:£Gğl;µTœã°ĞïÛH÷äÉz¨ñëW°õ¹zã%ÿO{İC27KŸûicaÚw@HŞ3)eluUHæ×“½øç”˜+‚“s¨	Ÿ	É:ÇÓÄû§xñ •ÁÿëÅÌ“Úö­ëÖs³õ^l-×TÓ‡¦rYÜ¯e½œùµş<?ÂåŞšÂ·Çôù~ş»zé¨ÜĞŞ²ÑEå“Æ!Ùç¼\œ…kº†dm˜’´İ>¹¾¼\VQú–¦ûÇVÒ6øj!\—
É~’÷Ò\ğLc¶.…ë{ààU~¦¸Ï/ø+}ÙÉ9hùÜ©g^]po\ëc {n’ŸV³a#¸h&Tâ‡Îl{¾š¤¤Üze8óşo`ÇŞòVÍìU[×Å÷hšÒ9‹ä“iü8‡ıc^*’õ=wÀGq\ÑZ<üåÜæôËu8m›ñÙø~Ñ >^»¹ÔÏÃ±q-İkı=AÌşŠ·ë…dîëPz`®<[¿®€—.Úú/ıgáÒóÅUgœ×P½÷ÅıßÇ§uäöZôV¬ãŸaß}!™ü™‡ƒŠÑÁµÕS1ÖãZL×éíºN­ºÓO=<ğûÄçò¥qŞ?qI+9m!=~vHöïxÁµßñõ<vêÎÇıÙ|ºöœWUô?¾ë÷B­SÕÄ|\[f=PÍ§ÖRË•Õæoøê?ôæÿæ¤WqGcÕqğAtmMºè^­ ŒæĞxê\\ÒMns\Oà´Çù{?÷ã·]l¶($sıJ°wK6êé™rßjœß™Og©Q'±å0ÕÎÊaÛÄÕò\ş‰ïÜßcWÃùGâıK¾x@lŸîü7A\eÒÃw³{lÏ‚Æ´E_öş’mÔ‡Ò|×Ë:H¿\¯hÆ—#ğÍóüŸ%æ{·È¥›ÄXÜ»j|÷Ã]µC²şzçÆcÕá'Îÿ- ~ò‹³‚´X×X„+¶¹_.<ÔÂôw>~i£Ï;á?.—ïŒ5y¹¼hHö¸Ïøê¸ÆHöúPûwik_5dä°ş{åìã›8¥•v×ËÓ)ÓRÏªÏ£ÍJ¤Æñtß¸_È&Xh–²áVšşuüÑ—}ªèËê«:Æ"Ç8÷q<Ÿ7·×ø|j¼Åõh¸Şİm¯6¸ŸÍÉ¾Òıôáv9¸ú`¿gËñıˆT}øÎ[K÷É+Ò†ß¸÷}8ëF6ÉN;ÑÆ|!ÙÓı|m<äú¯¥òÿjı¸Òs¸gê89m°Î››:¥O×ñÑ½¸¾q9¼MvNÔ’EµûCº$›ŸËoĞ¾§;ÿ’[C=ùó}èØì)–ÇËÏ/ÿZ‡‹Z‡d=ÈqÔ_Ì¿q|vœ<zŸøëè%h’{]û}¾®/>âíÅá¼»Sû*Àìî¬ñS^<VÄé¹S:¶/~îá¸¸¦õ›¸·¼¿¿õ‹áğJùõ~}ØgŒªœï—¦Ÿ<.ÛóuNö|ßõvhÛt5ìT×jÃ/Uğñ%Ú|>¼¬ÆºLş˜š{vHdÒı\ãm6©ˆŸ¯×®Ùl:T\upÜÓ´üVë>m/†¯Ó—¿Ø îÕ¹†6kæÿóø&‡¿'ÀXmœF·¬Æ´ôZ¹´pHŞúM_âZ†¹å€ßá,ìŒ¤Ñ†à÷åôüÍ>Ñ¹!Y×5[Ü„K*Àf5ú{ly@~ˆ/‹ĞÂ·³aYº³Ü[Ñ9·û,>[,
«¥èë©¾Ìãïÿ²C5UQÚôvŞèÅ×aºåwmøÄ5úÃ{ıIçîü76õ¬iÛüÛuC²ı¯|üÉ%Ïş.÷_OÃy«ŞÉıïÀ×_Î© / Ù~¦ï—ŠÕ_ä¯wàñ¤Ï¦Ğpß¹OıXìÜ­øø{5ås4ÿ©ézñˆãú”>š¦jóúù0ßq]qî6úóB±’áŞw§ôA¶Ô¸ø1|¸‡ş(’=ÛĞÌsÅwø]©æËà—•jÉáxŒßªN~V½õˆv½ë¸wÅÊ±VŒmàÕºìXVÉ£ƒØ*—ûpıîüÛ™Î9/$kìÄgº_x^±ZŞÚ£ß­Äï>