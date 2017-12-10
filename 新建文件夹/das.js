$(function(){
    var mySwiper = new Swiper ('.swiper-container', {
        // loop: true,
        paginationClickable:true,
        pagination: '.tab',
        paginationBulletRender(index,className){
            switch(index){
                case 0:
                    var name = '评价',type='pj';break;
                case 1:
                    var name = '打赏',type='ds';break;
                case 2:
                    var name = '买单',type='md';break;
            }
            return '<div class="tab-nav '+className+'">'+
                        '<i class="icon icon-'+type+'"></i>'+
                        '<span>'+name+'</span>'+
                    '</div>';
        },
    })  
})
//消息滚动
var $topnewsbox = $('.topnewsbox'),
topnewtimer = null;
if($topnewsbox.children().length>=2){
topmove();
}
var mgTp = (-1)*$('.message-text').height();
function topmove() {
topnewtimer = setInterval(function () {
    $topnewsbox.animate({
        'margin-top': mgTp
    }, function () {
        $topnewsbox.css('margin-top', 0).find('div:first').appendTo($topnewsbox);
    })
}, 3500);
}
var price = 0;
var words = [];
var star = 0;
//打赏
var $dsItms = $('.btn-item').not($('.btn-item').last());
$dsItms.on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
    $('#diy_price').val('');
    var index = $(this).index();
    if (index < 7) {
        $('audio')[index].play();
    }
    price = parseInt($(this).children().eq(0).text());
});
$('#diy_price').on('focus', function () {
    $(this).parent().addClass('active').siblings().removeClass('active');
    $('audio')[6].play();
    price = 0;
})
$('#diy_price').on('blur', function () {
    price = parseInt($(this).val());
    if (!price || price <= 0) {
        $(this).val('');
        price = 0;
        $(this).parent().removeClass('active');
    }
})
$('#diy_price').on('keyup',function(){
    var val = $(this).val();
    if(val<1){
        $(this).val('');
    }else{
        $(this).val('');
        $(this).val(parseInt(val));
    }
    var num = $(this).val().length;
    if(num>4&&num<=6){
        $(this).css('fontSize','.5rem')
    }else if(num>6){
        $(this).css('fontSize','.35rem')
    }else{
        $(this).css('fontSize','.65rem')
    }
})
//评价
$('.remark-item').click(function () {
    if ($(this).hasClass('active')) {
        $(this).removeClass('active')
        var index = words.indexOf($(this).children().eq(0).text());
        words.splice(index, 1);

    } else {
        $(this).addClass('active');
        words.push($(this).children().eq(0).text());

    }
});
$('#pj').on('focus', function () {
    var $this = $(this);
    $this.parent().addClass('active');
    $this.val('');
})
$('#pj').on('blur', function () {
    var $this = $(this);
    if (!$this.val()) {
        $this.val('');
        $this.parent().removeClass('active');
    }
})
//星星
var $starItems = $('.star-box span');
$starItems.click(function () {
    var now_index = $(this).index();
    $starItems.removeClass('active').each(function (index, item) {
        if (index <= now_index) {
            $(item).addClass('active');
        }
    })
    star = now_index + 1;
    switch (star) {
        case 1:
            $('.star-text').text('非常不满意');
            break;
        case 2:
            $('.star-text').text('不满意');
            break;
        case 3:
            $('.star-text').text('一般');
            break;
        case 4:
            $('.star-text').text('比较满意');
            break;
        case 5:
            $('.star-text').text('非常满意');
            break;
        default:
            break;
    }
});
//提交
$('.submit-btn').click(function () {
    var $this = $(this);
    if ($this.hasClass('disable')) {
        return false;
    }
    var words_str = '';
    words.forEach(function (item) {
        words_str += item + '$$$';
    });
    if (star == 0) {
        alert("请选择星级");
        $('.tab-nav').eq(0).click();
        return false;
    };
    if (!words_str) {
        alert('选个评价语吧，亲');
        $('.tab-nav').eq(0).click();
        $('#pj').focus();
        return false;
    }
    $this.addClass('disable')
    $.ajax({
        method: 'post',
        url: submitUrl,
        data: {
            staff_id: staff_id,
            amount: price,
            words: words_str,
            pj: $('#pj').val(),
            star: star
        },
        success: function (res) {
            obj = $.parseJSON(res);
            if (obj.code == 200) {
                window.location = '/reward/jsapi/intermediary?reward_id=' + obj.data.reward_id;
            } else if (obj.code == 300) {
                $('.success-box').show();
                $('.bannerasd').show();
                $('.page').hide();
            } else {
                alert(obj.message);
            }
            $this.removeClass('disable')
        }
    });
});