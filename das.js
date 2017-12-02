// tab
var tabNavs = $('.tab-nav');
var tabContents = $('.tab-content');
tabNavs.on('click', function () {
    var index = $(this).index();
    $(this).addClass('active').siblings().removeClass('active');
    tabContents.hide().eq(index).show();
    if (index == 2) {
        $('.submit').hide()
    } else {
        $('.submit').show()
    }
})


var staff_id = 1 || "{$staffinfo.staff_id}";
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
    console.log(price)
});
$('#diy_price').on('focus', function () {
    $(this).parent().addClass('active').siblings().removeClass('active');
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
        $this.val('如果有其他意见或建议，请放心填写，感谢您的支持！');
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
    console.log(words_str)
    if (star == 0) {
        alert("请选择星级");
        tabNavs.eq(0).click();
        return false;
    };
    if (!words_str || !$('#pj').val()) {
        alert('评价一下吧，亲');
        tabNavs.eq(0).click();
        $('#pj').focus();
        return false;
    }
    $this.addClass('disable')
    $.ajax({
        method: 'post',
        url: "{:url('/reward/submit')}",
        data: {
            staff_id: staff_id,
            amount: price,
            words: words_str,
            pj: $('#pj').val(),
            star: star
        },
        success: function (res) {
            return false;
            obj = $.parseJSON(res);
            if (obj.code == 200) {
                window.location = '/reward/jsapi/intermediary?reward_id=' + obj.data.reward_id;
            } else if (obj.code == 300) {
                $.toast('感谢您的评价');
                $('.successBox').show();
                $('body').css('overflow', 'hidden')
            } else {
                $.alert(obj.message);
            }
            $this.removeClass('disable')
        }
    });
});