let req;
let baseUrl;

$(function() {
    $("a").hover(
        function() {
            baseUrl = $(this).attr("href");
            request("interior");
        },
        function() {
            cancelRequest();
        }
    );
});

function request(context) {
    cancelRequest();
    const dataSource = createUrlDataSource(baseUrl);
    req = $.ajax({
        type: 'GET',
        url: dataSource[context],
        dataType: 'html',
        success: function(data) {
            const imageUrls = parseImageUrl(data)
            appendOverlayElement($, imageUrls, context);
        },
        error: function() { console.log('error'); }
    });
}

function cancelRequest() {
    if (req != null) {
        req.abort();
    }
}

function createUrlDataSource(baseUrl) {
    return {
        "food": `${baseUrl}dtlphotolst/1/smp2/`,
        "interior": `${baseUrl}dtlphotolst/3/smp2/`,
        "exterior": `${baseUrl}dtlphotolst/4/smp2/`
    }
}

function parseImageUrl(htmlString) {
    let imageUrls = [];
    const images = $(htmlString).find("ul.rstdtl-photo__content.clearfix").find("img");
    images.each(function() {
        const imageUrl = $(this).attr("src");
        imageUrls.push(imageUrl);
    });
    return imageUrls;
}

function appendOverlayElement($, imageUrls, context) {
    if ($("#modal-overlay, #modal-content").size() > 0) return;

    $("body").append('<div id="modal-overlay"></div>');
    $("body").append(`
        <div id="modal-content">
            <div>
                <span id="modal-menu-food">料理</span>
                <span id="modal-menu-interior">店内</span>
                <span id="modal-menu-exterior">店頭</span>
                <a href="${createUrlDataSource(baseUrl)[context]}">詳細を見る</a>
            </div>
            ${createImageElements(imageUrls)}
        </div>
    `);
    setTimeout(function() { centeringModalSyncer($); }, 500);

    fixBodyPosition($);
    $("#modal-overlay, #modal-content").fadeIn("slow");

    setClickListener($);
}

function fixBodyPosition($) {
    const currentY = $(window).scrollTop();
    $("body").css({"position": "fixed", "top": -1 * currentY});
}

function setClickListener($) {
    $("#modal-overlay").click(function() {
        hide($);
    });
    $("#modal-menu-food").click(function() {
        hide($);
        request("food");
    });
    $("#modal-menu-interior").click(function() {
        hide($);
        request("interior");
    });
    $("#modal-menu-exterior").click(function() {
        hide($);
        request("exterior");
    });
}

function hide($) {
    $("#modal-overlay, #modal-content").fadeOut("slow", function() {
        $("#modal-overlay, #modal-content").remove();
        $("body").css({"position": "static"});
    });
}

function createImageElements(imageUrls) {
    let imageElements = [];
    for (const imageUrl of imageUrls) {
        imageElements.push(`<img src="${imageUrl}">`);
    }
    return imageElements.join('');
}

function centeringModalSyncer($) {
    const width = $(window).width();
    const height = $(window).height();
    let contentWidth = $("#modal-content").width();
    let contentHeight = $("#modal-content").height();
    const pxLeft = ((width - contentWidth) / 2);
    const pxTop = ((height - contentHeight) / 2);
    $("#modal-content").css({"left": pxLeft + "px"});
    $("#modal-content").css({"top": pxTop + "px"});
}
