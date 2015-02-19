(function() {
    si.ui = {};

    si.ui.myAlert = function(_args){
        var dialog = Ti.UI.createAlertDialog({
            message: _args.message,
            title: _args.title || '',
            //ok: 'OK'
        });
        //si.sound_attention.play();
        si.sound_reminder.play();      
        dialog.show();
    };


    si.ui.alert_no_parent = function(){
        si.ui.myAlert({message:'Load parent first', title:''});
    };

    si.ui.createApplicationTabGroup = function(_args) {
        var tabGroup = Ti.UI.createTabGroup({
            height : 300
        });
        
        var tabMain = Ti.UI.createTab({
            title : 'Main',
            //icon : '/images/plus.png',
            window : si.ui.createAddChildWindow()
        });

        var tabSettings = Ti.UI.createTab({
            title : 'Options',
            //icon : '/images/preferences.png',
            window : si.ui.createSettingsWindow()
        });

        var tabHelp = Ti.UI.createTab({
            title : 'Info',
            //icon : '/images/preferences.png',
            window : si.ui.createInfoWindow()
        });

        tabGroup.addTab(tabMain);
        tabGroup.addTab(tabSettings);
        tabGroup.addTab(tabHelp);
        return tabGroup;
    };

    si.ui.createInfoWindow = function(){
        var win = Ti.UI.createWindow({
            title : 'Info',
            backgroundColor : 'white',
            barColor : '#336699',
            orientationModes : [Ti.UI.PORTRAIT],
            backButtonTitle : 'Back',
            layout : 'vertical'
        });
        var info_view = Ti.UI.createView({
            width : '90%',
            height : '30%',
            layout : 'vertical',
            top : '10%',
            //backgroundColor : 'blue'
        });

        var label_version = Ti.UI.createLabel(si.combine($$.NormalButton, {
            //font : font,
            top : '45%',
            textAlign : 'center',
            text : Ti.App.name + ' Version ' + Ti.App.version 
        }));


        var buttonHelp = Ti.UI.createButton(si.combine($$.NormalButton, {
            title : 'Help',
            font : {fontSize:36},
            borderRadius : 10,
            width : '80%',
            height : Ti.UI.SIZE
        }));
        buttonHelp.addEventListener('click', function(e) {
            Ti.Platform.openURL('http://dream.misasa.okayama-u.ac.jp/documentation/');
        });
        //var webview = Ti.UI.createWebView({url: 'http://dream.misasa.okayama-u.ac.jp/documentation/'});
        info_view.add(label_version);
        //info_view.add(label_publisher);
        win.add(info_view);
        win.add(buttonHelp);
        return win;
    }
    
    si.ui.createInputPrint = function(opts){
        var view = Ti.UI.createView({
            height : Ti.UI.SIZE,
            //backgroundColor : 'red',
            layout : 'horizontal'
        });

        var imgDimensions = 30;
        var text = Ti.UI.createTextField(opts);


        var imageButtonView = Ti.UI.createView({
            width : 60,
            height : 60
        });
        var imageView = Ti.UI.createImageView({
            image : '/images/glyphicons-16-print.png',
            width : imgDimensions,
            height : imgDimensions            
        });


        var button = Ti.UI.createButton({
            title : '',
            width : 60,
            height : 60
        });

        button.addEventListener('click', function(e) {
            if (!Ti.App.Properties.getBool('printLabel')){
                alert('Please switch on');
                return;
            }
 
            var string = 'hello world';
            if (text.value == '') {
                string = 'print test';
            } else {
                string = text.value;
            }
            si.ui.android.printLabel(string, string);
            // if (!si.config.Medusa.debug) {
            //     si.TiBar.scan({
            //         configure : si.config.TiBar,
            //         success : function(_data) {
            //             if (_data && _data.barcode) {
            //                 text.value = _data.barcode;
            //             }
            //         },
            //         cancel : function() {
            //         },
            //         error : function() {
            //         }
            //     });
            // }
        });
        imageView.addEventListener('click', function(e) {
            button.fireEvent('click', e);
        });


        var view_left = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : '90%',
            left : 0,
            //backgroundColor : 'orange',
            //layout : 'vertical'
        });
        var view_right = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : '10%',
            left : 0,
            //backgroundColor : 'yellow',
            layout : 'horizontal'
        });

        view.add(view_left);
        view.add(view_right);
        view_left.add(text);
        view_right.add(imageButtonView);
        imageButtonView.add(button);
        imageButtonView.add(imageView);
        //view_right.add(button);
        //view_right.add(imageView);

        view.set_value = function(value){
            text.value = value;
        }
        view.input = text;

        return view;
    }

    si.ui.createScanInput = function(opts){
        var view = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : Ti.UI.SIZE,
        });

        var text = Ti.UI.createTextField(opts);


        var imageButton = si.ui.createImageButtonView('/images/barcode.png', {
            width : 90,
            height : 90,
            imgDimensions : 30,
        });
        imageButton.button.addEventListener('click', function(e) {
            if (!si.config.Medusa.debug) {
                si.TiBar.scan({
                    configure : si.config.TiBar,
                    success : function(_data) {
                        if (_data && _data.barcode) {
                            text.value = _data.barcode;
                        }
                    },
                    cancel : function() {
                    },
                    error : function() {
                    }
                });
            }
        });


        var view_left = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : Ti.UI.SIZE,
            right : imageButton.width,
        });
        var view_right = Ti.UI.createView({
            height : Ti.UI.SIZE,
            width : Ti.UI.SIZE,
            right : 0,
        });

        view.add(view_left);
        view.add(view_right);
        view_left.add(text);
        view_right.add(imageButton);

        view.set_value = function(value){
            text.value = value;
        }
        view.input = text;

        return view;
    }

    si.ui.createMyImageView = function(opts){
        if ( typeof opts == 'undefined') {
            opts = {};
        };
        if (!('width' in opts)) {
            opts.width = '100%';
        }
        if (!('height' in opts)) {
            opts.height = '100%';
        }

        var view = Ti.UI.createView({
            width : opts.width,
            height : opts.height            
        });

        var optionDialog = Ti.UI.createOptionDialog({
            options : ['Add snap shot', 'Add local file'],
            //cancel : 2,
            title : ''
        });
        optionDialog.addEventListener('click', function(e) {
            switch (e.index) {
                case 0:
                    Ti.Media.showCamera({
                        success : function(event) {
                            if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                                view.set_image(event.media);
                            }
                        },
                        cancel : function() {
                        },
                        error : function(error) {
                        },
                        saveToPhotoGallery : true,
                        allowEditing : true,
                        mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
                    });
                    break;
                case 1:
                    Ti.Media.openPhotoGallery({
                        success : function(event) {
                            if (event.mediaType == Ti.Media.MEDIA_TYPE_PHOTO) {
                                view.set_image(event.media);
                            }
                        },
                        cancel : function() {
                        },
                        error : function(error) {
                        },
                        allowEditing : true,
                        mediaTypes : [Ti.Media.MEDIA_TYPE_PHOTO]
                    });
                    break;
                default:
                    break;
            };
        });

        if (!opts.image){
            var photoButtonView = si.ui.createImageButtonView('/images/167-upload-photo.png', {
                width : 90,
                height : 90,
                imgDimensions : 30
            });
            photoButtonView.button.addEventListener('click', function(e) {
                optionDialog.show();
            });
            view.add(photoButtonView);
        } else {
            view.set_image(opts.image);
        }

        view.set_image = function(_image){
            view.removeAllChildren();
            var flame = Ti.UI.createView({
                height : '95%',
                width : '95%',
                backgroundColor : 'black'
            });
            var imageView = Ti.UI.createImageView({
                center : { x: '50%', y : '50%'},
                image : _image
            });
            imageView.addEventListener('click', function(e) {
                optionDialog.show();
            });
            view.add(flame);
            flame.add(imageView);
            view.image = _image;
        }

        return view;
    };

    si.ui.createImageButtonView = function(_image, opts) {
        if ( typeof opts == 'undefined') {
            opts = {};
        };
        if (!('width' in opts)) {
            opts.width = '100%';
        }
        if (!('height' in opts)) {
            opts.height = '100%';
        }
        if (!('imgDimensions' in opts)) {
            opts.imgDimensions = 45;
        }

        var view = Ti.UI.createView(opts);
        
        var button = Ti.UI.createButton({
            title : '',
            //backgroundColor : 'white',
            width : '100%',
            height : '100%'
        });
        view.add(button);

        var imageView = Ti.UI.createImageView({
            image : _image,
            //backgroundColor : 'blue',
            width : opts.imgDimensions,
            height : opts.imgDimensions            
        });
        imageView.addEventListener('click', function(e) {
            Ti.API.info('image clicked');
            if (button.enabled){
                button.fireEvent('click', e);
            }
        });
        view.add(imageView);

        var self = view;
        self.button = button;
        self.imageView = imageView;
        self.setEnabled = function(value) {
            self.button.setEnabled(value);
            self.imageView.setTouchEnabled(value);
        };
        return self;
    };

    si.ui.createInputOrScanWindow = function(opts){
        if ( typeof opts === 'undefined') {
            opts = {};
        }

        var win = Ti.UI.createWindow({
            title : opts.title || 'ScanInput',
            backgroundColor : 'white'
        });

       var viewBase = Ti.UI.createView({
            backgroundColor : 'white',
            top : 0,
            width : '100%',
            height : '100%',
            layout : 'vertical'
        });

        var viewHeader = Ti.UI.createView({
            backgroundColor : 'white',
            height : '25%'
        });

        var viewBody = Ti.UI.createView({
            backgroundColor : 'white',
            top : 0,
            top : 0,
            height : '85%'
        });


        var scan_input = si.ui.createScanInput(si.combine($$.TextField, {
            value : opts.value || '',
            keyboardType : opts.keyboardType || Ti.UI.KEYBOARD_DEFAULT,
            hintText : opts.hintText || ''
        }));

        var cancel_button = Ti.UI.createButton(si.combine($$.LeftBottomButton, {
            top : 0,
            title : 'Cancel',
        }));

        cancel_button.addEventListener('click', function() {
            win.close();
        });


        var save_button = Ti.UI.createButton(si.combine($$.RightBottomButton, {
            top : 0,
            title : 'OK',
        }));

        save_button.addEventListener('click', function() {
            opts.save(scan_input.input.value);
        });

        win.save_button = save_button;

        win.add(viewBase);
        viewBase.add(viewHeader);
        viewBase.add(viewBody);

        viewHeader.add(scan_input);
        viewBody.add(cancel_button);
        viewBody.add(save_button);

        win.set_value = function(value) {
            scan_input.set_value(value);
        }
        win.input = scan_input.input;

        return win;        
    };

    si.ui.createViewParent = function(_record, opts) {
        if ( typeof opts === 'undefined') {
            opts = {};
        }
        if (!('width' in opts)) {
            opts.width = '100%';
        }
        if (!('height' in opts)) {
            opts.height = '100%';
        }
        if (!('imgDimensions' in opts)) {
            opts.imgDimensions = 45;
        }

        spacing = 5;
        nameHeight = '50%';
        metaHeight = 14;
        var view = Ti.UI.createView({
            width : opts.width,
            height : opts.height
        });
        var imageView = Ti.UI.createImageView({
            top : spacing,
            left : spacing,
            height : opts.imgDimensions,
            width : opts.imgDimensions,
            backgroundColor : '#000000',
            image : null
        });
        view.add(imageView);

        var avatarOffset = spacing * 2 + opts.imgDimensions;

        var labelMeta = Ti.UI.createLabel(si.combine($$.smallText, {
            text : '',
            top : spacing,
            left : avatarOffset,
            right : spacing,
            height : 'auto',
            textAlign : 'left'
        }));
        view.add(labelMeta);

        var labelName = Ti.UI.createLabel(si.combine($$.boldHeaderText, {
            text : '',
            top : metaHeight + 10,
            left : avatarOffset,
            height : nameHeight
        }));
        view.add(labelName);

        update = function(_record) {
            if (_record == null) {
                labelMeta.text = '';
                labelName.text = '';
                imageView.image = '';
                return;
            }
            labelMeta.text = _record.global_id;
            labelName.text = _record.name;
            //!!!!!!!!!画像のパスの取得は要検討!!!!!!!!!!!!!!!!!!!!!!
            if (_record.image_path) {
                //Ti.API.info("image_path");
                //Ti.API.info(_record.image_path);
                //var _path = Ti.App.Properties.getString('server') + '/' + _record.image_path;
                var _url = si.imageURL(_record.image_path);
                //Ti.API.info(_url);
                imageView.image = _url;
            } else {
                imageView.image = '';
            }
        };

        var self = view;
        self.imageView = imageView;
        self.labelMeta = labelMeta;
        self.labelName = labelName;
        self.update = update;
        self.update(_record);
        return self;
    };

})();

Ti.include('/sisyphus/ui/styles.js');
Ti.include('/sisyphus/ui/LoginWindow.js');
Ti.include('/sisyphus/ui/SettingsWindow.js');
Ti.include('/sisyphus/ui/LabelPrintSettingWindow.js');
//Ti.include('/sisyphus/ui/PrintServerSettingWindow.js');
//Ti.include('/sisyphus/ui/PrintFormatUrlSettingWindow.js');
//Ti.include('/sisyphus/ui/ServerSettingWindow.js');
Ti.include('/sisyphus/ui/NewStoneWindow.js');
Ti.include('/sisyphus/ui/NewBoxWindow.js');

//if (Ti.Platform.name == 'iPhone OS') {
//        Ti.include('/sisyphus/ui/AddChildWindow.js');
//}

if (Ti.Platform.osname == 'android') {
    Ti.include('/sisyphus/ui/android/AddChildWindow.js');
}
