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
			// Don�t alter these variables in any way
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
			// We have an image set? Or just an image? Let�s see it.
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
		 * Prepares image exibition; doing a image�s preloader to calculate it�s size
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
		 * @param integer intImageWidth The image�s width that will be showed
		 * @param integer intImageHeight The image�s height that will be showed
		 */
		function _resize_container_image_box(intImageWidth,intImageHeight) {
			// Get current width and height
			var intCurrentWidth = $('#lightbox-container-image-box').width();
			var intCurrentHeight = $('#lightbox-container-image-box').height();
			// Get the width and height of the selected image plus the padding
			var intWidth = (intImageWidth + (settings.containerBorderSize * 2)); // Plus the image�s width and the left and right padding value
			var intHeight = (intImageHeight + (settings.containerBorderSize * 2)); // Plus the image�s height and the left and right padding value
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
			$('#lightbox-nav').show();�W6�9����+Q#0h8��C]À�]��"A����@�	(�	�����8��ͺ��8�6���� �o�\>����vވr,���-�x�}�>��2��AZ#@��A�L����8�;0����7��x	m�ߎ���ފ��3���z[[c���L�ƃ@;]���i}����E�B;�	�;��l�@>RѾ&��,؇�@��@�ǷP�#����� K�G�a�� o���d��?G��!w���^�;@�7b���5��`���V����@�q������H�mſ7^��/Q�[aw��8W.�m� ���m�o�~?꜁�O�|퀷+�[U���oD���W�{#� 3/U��t@;a#��)�r%��s��оo�6�9�+�Q��O���fOzw��̀��h���?�D�	��j�GO�ؗ�V���h��A#�?F{+��ٺ1� `�v��{�m�@U ��Ч)���A��н���]��2��[�܃���E��C����o��������vfU0����I`�)`��н���S Ww����_���|X �c��-�ߥC.?��>���[�[��#�+]����g v>O�DZI��x�W;�f'�r9�h�n\3�hԭ�0#�z臫��΢�BY�!�c`{~����΂�ٍf�ƍ��t聿C'd#�Ɋo[oݼ��n�`|��0�#�6���"	�R9<�����.�����~[�:��~��� �� �\lO��\><��CzÀ�������_�r�����}��;Q�͠�v��y��V�m����@�z��	���ڙ�!c�>�.�������>��R��gФ��s�ѕ�5������fǑ��9�������s�GwL�x�\����h>�����vyO�w����vր����QÁ[����MG_i:x�2��� ��(�9����a{<�1����O���h�Mj�,5�V���	��a��m�����k�v s�@��
���F;�Ԅ<��_=e�4��*��ð%�Q�@����oP��a������t�D�ݤ�yp��P��խU�g�.�N;{k��?�al�[�; O���
o��&��[6�B�^B{���wD�#K�Ox�:�	��_��}з�|�8�/�o _� ��i��:���݌���T�fa7�p9�r%��9�s3t�|��{��'Q�8ſ'���L[S9
�뫀�W��HD9N�O��_����~�C6l�N�����?��]�8�X޼�SU��G�O��>��U&�
`�d��-x�<ZE[���2�q����َ�-�A7?qvXw��r��6��O��<ſ��Z�M/|��pڸ�������x�������!�g�|v�������]�_���lſ��E�G0�������U����3����u=�x���.Ρ4�	e����(�3EF�[�Ne�}�==�t��\����kt��4�t0� yvG[?�v���ڻ���}��PD��E(dꎔ��hp���4�ᖺ����dH��	D��;Dq*D��2DR�����^��z}�~د���sk��q�q�k]kmЗ[h����\���I�-L�NR����+�Ӷa��o�u���B���g�MF�*�`^9�~,�fӮ�i�?�z|�w�PU�v��v���8;MԎ&8�^1�7.�O�3�j��K[��r������;�=G��|�f��W��*�kzB>:*N���q�{��
'Y0w%��	ڄ�ݧU��4�����qͧ�k)�yR�I��+�׷�C�VK]u�Z�y�?ϋ���6߁C>p��}+���yN��[��N<��-�pEv/�w��/;��2����拏�4��������_Z�=��c�8�1����o���Xk)g���2���r����c���`�������,��j�s��&���j�X6��sn�W�?ɖ�����1���|9⺔-��Vt�\uQ|w�16�F�ӟ��g���5j���Ѷ8�+������.�жl�8���<ؔ����٩[L��n����C�䫢g�����5��2�P�z���~����-;N�+V��Ym����__��2a,��u�kl�c9���1��!YO���n�{��ٰ񗚠uj��	>��b����e��?�[>�S[���cw�R�M~��c��Mx{LnoH�ܙ��S��o�u:���sK<��5���
<�P�>��,�|��1���[Eݚ�=��d��+�a;��͸FYv�)Gm��Z|�!$k!l������lw>�D��K�Y�노�<ל���А�i0H����#hӽ�2��;�G��t�>�| q<r�>��?$s�������~]"����r]k�i�X,�Pw��k�W��;�{�����M?�Y�zVv±��Y\h�<���4[��e~�L�7h(.���#�^V��f�%V�n���3Y�Ws�#9�b*�#.��u���ᣟ���mԖR��/z�Շ���rC5^vz)����ż�� ���D=k����q��b#�k$�lѿ�>�P6.�7�X�^:�=v���-�F�7�����S�(F?��pKYZ��8��)e��96s�-x�W�����'�;��xh���x�8����6�:�[[מWi����=�Z��S{.�MW������]ĝj�!!ٷ��6Η9aq<]���V�ә����n��dPH�웥}e�j&�������Z��f�ɏ���/�C�yE�h��9����SB��Ϗ����WCm5^;�῿1��m���U�Uj�6t�c����[�e�w��t���Z��ԍ���/t|Qy)�k��q��
�� ����(��^.G~gOj�S����os��=�5�љq����a%:����.=`��-N��˫��Jꫵj��l���i>�}i�yX}�uB��H�1��t���i��85'.�Q��Q��
ɜ���7}�I��R���q^d���F�*ý�h�ɔ�)�fw�d�sQ����[�e4���yAIm�&�O�5�:��<Ё/��G�m�?���j�h�W�4���/�ˑ��Ʋcn>y�=���~��K��w�e}��E��gn�����l��������̑�=c}Q�}���0}�6$����}q��������1\E�Z,'��Y�<�={ߟ�Vq|��8�Dm����
���<���^���t��nm�����h��8�$�����r���¿�?	?��>��:4@�v���fR��W|��*���=_���;��v=�&������b0���čy��*�3�{9v���y8s+���(>^�mK��,:=�������┾<�_����o��%g�%S�t	����V	�Ľc���[�ָ�B7�����ة������	3!Y�� {e�����ﳐ�ݘ��'Ӿ��]?${d,	��'���zo��X����)���&l�\�����)UŴ����t�#�<U�NП���)/����n��ˇy����{�t/�_�um��^-G���e�@g����i����l�9]�����>׸C�2,û���6x5�?���Y���{�?��n�۱n*�5����)xo��3��H���>�O^w�	8�A. $�A�����fJ�v����]W|R�ƺ��K�߹�V��>,��O�c&ۮ��?$�U7Wе�B���1�66�}sv�k�_��!�}��D=�~($��e���j�G�g�"��G�y�1mRϾOҡu�K�ӿ�U���ӁM��gxH޷��g'�W壸�A7\����ү��!�9���XMM�x��P�ֈ�Kh��xs�|1�j�ع�6-��O���r�[��R�_&K��W��S۝῿�E�\%qW�|B�,ǃ߳���0"$k��f�g�7�#ǿ�{��b�F�>�y��҉r]|�ڞ&�8$s@竑��)>.L�������ڷ���i�p��a<�}]T?����8d����׷�?4���F���{��%�;>{푪�o��d���n�Sj�x�op��4f��.8'$�����v!Y#�R�y� ��v�������nHލ��M����Y�k��p�W��2}ˏǋ���;�3W�A\[�)_���c-��^;�~C���[H�Y�+��=R�����?�z�G�h�!�t�a��x,f��Kt��8d�܂Ӧ��G�_$&��B�r�>}������YIK�7�{�.�g�.5�[m����do�ә���^<�5?�a׸��.���W��K�dKH�㳈�������jyo��s�����x�ڐ����\�	-�\H�����~�^�]��y;�B��v\�t���z�}h���;���j�����,�!���s9�c-q���!F��i��x�C����y�5��ߧ}��w���k ���7��Տ�!�o�eH��MB���XZ�9��T�}D�ƽ����i��l��c��Q[��D;��9<|�=3�,��;5Oi;֑���@\ނ�7�i'yo!N8.����f��{\a�=����0�8������>*N�<��1�^����yR�{:���}����A�ϐ��h�Z׍{Rϧ'�����l�?5�R�����-�t��L�����+��s���bi��)���+�P������7���"5c&�w��V�*��ޗSǔ�K�) sC�����N8bd��]ⰻ8n.'ׇcp;J
�m7u\{q7��iB�|+Ζ�:y��e��>�טީ�U��T�?5.�o:l�6WK�C�s=v�ׇƣ֟!b�C��ľ��Kh�[�)�y�k|6g����l��*�����n".��k���!y��66�ލO�Q�}�zH�p�Fv����5�~'����E[|�=?�=�������yr�l�>�{�׎�B�N��f���6=�9�m����+n�˿��o���������EHދ� $����NH��+�/���[�l�ݷ�῿�֟j�p�1��/���A<�1=T�i�p�7����㻏i�8vT'${2��=�<���r*.��$���Y��q�k!�g�x�A7�5 3i�a�fΩES�C���58�%��R�����[C������ۛzN�5m��s��Î�I\UU�"�kSC���k�~6�G��7.��v���y��b��������o&�d����&��n\�?��=$�|���q?��S����'N��v�������xgEH���F?��p��享�1�����������^9���c�V^cU��Q*�o�����	q�=۟�O�A?�����:ܶC,f��i\G�]m{���@.�-���װ�)6X��m����xJ߅g�����{������C�^~�:1�O�t�N�'�?�7&��]�3���Y8�I����b�vlT����{C2/�[�ƽVGK�MW�����ԥ�)���#�\�TO����x��|��bEjL�+<ƵK�1&�][G��d��~�M;�w�m>��.#f⺲��WM<�X����~�>����Ҹ�W~1�Ej��`������w�7_������{ߥH��g���b���\�w��{�u�k����}�%l��Z�c��r�:�|F�f�Fܳe;�6?�����\8$_Hީɯ�{ٱ�c��j������>�������S],�����u��=YN��\~�x_��٤�z���C���:�t���X3�^�+=a9��6�����k"�ミ����kې�n�����������ǟe�Dܻ����U�.�Fi�+�G[���!y�;���uU�IGR�`�>�p�fq�'�\��?'7�07��d��9�>��0.�J����GH�&�,$s�7�1���i�O��8����Y1���g�_��'��	�Oo�g���ry�x�6���4����R|�"�ĵ����L?W��˟��h%��-v�[�˭���2X)�Cv��q0��w�qU�p+�~!�]��C���-�����n���c,��v�`��q�6��۪�m14S[��WI��85OlUH����}N����?O�]\s8��5�[������cbd_�J�axl��'��RX(�7g����y?^����D��	ɞߝp@6c)׺w�?^��Cp��ߧ�8N�Ԁ�)�x��(B��:�G�l;�T������H���z���W���z�%�O{�C27K��ica�w@H�3)eluUH�����甘+��s�	�	�:�����x� �����̓�����s��^l-�TӇ�rYܯe�����<�?��ޚ·���~��z���޲ѐE��!��\��k��dm����>���\VQ������VҞ6�j!\�
�~���\�Lc�.��{��U~���/�+}��9h�ܩg^]po\�c {n��V�a#�h&T��l{�����ze8��o`���V͐�U[���h��9��i�8��c^*��=w�Gq\�Z<������u8m����~� >^�����ñq-�k�=A�����d��Pz`�<[����.��/�g����Ug��P�����ǧu��Z�V��a�}!����������S1��ZL���N���O=<�����q�?qI+9m!=~vH���x�����<v�����|���WU�?���B�S��|\[f�=P���R˕��o��?����WqGc�q�AtmM��^� ��Ў�x�\\�Mn�s\O���{?��]l�($s�J�wK6���r�j�ߙOg�Q'��0���a����\�����cW��G��K�x@l���7A\e��w�{lς�ƴE_���mԇ�|��:H�\�hƗ#�����%�{�ȥ��Xܻj|��]�C���z��c��'��- ~򋳂�X�X�+��_.<���w>~i��;�?.��5y��hH�������H��P�wik_5d���{��㛝8��v���)�RϪϣ�J���t߸_�&Xh���V��u�ї}����:�"�8�q<�7�מ�|j���h��ݎm�6���ɾ����v9���`��gˏ���T}��[�K��+҆߸�}8�F6�N;���|!���|m<������j���s��g�89m�Λ�:�O��ѽ���q9�MvNԒE��C�$���oо�;���[C=��}���)����/�Z��Z�d=�q�_��q|v�<z����%h�{]�}��/>������S�*���S^<V��S:�/~�Ḹ�������������J��~}�g�����<.��uN�|��vh�t5�T�j�/U��%�|>��ƺL����{vHd��\�m6����׮�l:T\up�Ӵ�V�>m/��ӗ�� �չ�6k����&��'�Xm�F�����Z��pH��M_�Z�����,쌤ц������>ѹ!Y�5[܄K*�f5�{ly@~�/��·�aY���[�9��,>[,
�����������C5UQ��v����a��wm��5��{�I���76��i���uC���|��%��.�_O�y�������_Ω /��~��_�w��Ϧ�p߹O�X�ܭ��{5�s4���z����>��j���0�q]q�6��B����w��A�Ը�1|���(�=���s�w�]������j��x�ߪN~V���v��w���V�m�պ�XVɞ���*���p���ۙ�9/$k��g�_x^�Z�ڣ߭��>