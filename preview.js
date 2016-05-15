let request;
$(function() {
    $("a").hover(
        function() {
            cancelRequest();
            const detailUrl = $(this).attr("href");
            const dataSource = createUrlDataSource(detailUrl);
            requet = $.ajax({
                type: 'GET',
                url: dataSource["interior"],
                dataType: 'html',
                success: function(data) {
                    const imageUrls = parseImageUrl(data)
                    console.log(imageUrls);
                },
                error: function() { console.log('error'); }
            });
        },
        function() {
            cancelRequest();
        }
    );
});

function cancelRequest() {
    if (request != null) {
        request.abort();
    }
}

function createUrlDataSource(detailUrl) {
    return {
        "food": `${detailUrl}dtlphotolst/1/smp2/`,
        "interior": `${detailUrl}dtlphotolst/3/smp2/`,
        "exterior": `${detailUrl}dtlphotolst/4/smp2/`
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
