$(document).ready(function() {
    let rotationAngle = 0;
if($(window).width() < 768) {
    

    $("#aniPrevBtn").on('click', function(){
        rotationAngle -= 60;
        $(".pf-inner-web").css('transform', `rotateY(${rotationAngle}deg)`);
    });

    $("#aniNextBtn").on('click', function(){
        rotationAngle += 60; // 각도 60도 증가
        $(".pf-inner-web").css('transform', `rotateY(${rotationAngle}deg)`); // 회전 적용
    });
   
    } else {
    // window 크기가 768보다 클때
    }
})

let rotationAngle = 0;
if (matchMedia("screen and (max-width: 767px)").matches) {
    
    let articles = document.querySelectorAll('.pf-inner-web > article');
    let totalArticles = articles.length;
    let rotationAngleIncrement = 360 / totalArticles;
    let currentArticleIndex = 0; 

    updateViewedImage();
        

    // article 요소들을 회전시킵니다.
    articles.forEach((article, index) => {
        let rotationAngle = index * rotationAngleIncrement;
        article.style.transform = `translateZ(50vh)`;
        // 회전 각도를 데이터 속성에 저장합니다.
        article.dataset.rotationAngle = rotationAngle;
    });

    $("#aniPrevBtn").on('click', function(){
        currentArticleIndex = (currentArticleIndex + 1 + totalArticles) % totalArticles;
        updateViewedImage();
    });

    $("#aniNextBtn").on('click', function(){
        currentArticleIndex = (currentArticleIndex - 1) % totalArticles;
        updateViewedImage();
    });

    // 이미지를 업데이트하는 함수
    function updateViewedImage() {
        // 현재 회전 각도를 가져옵니다.
        let currentRotation = 360 - (currentArticleIndex * rotationAngleIncrement);
        // 회전 각도가 360도를 초과할 경우 0으로 되돌립니다.
        currentRotation = currentRotation % 360;
        // 회전 각도가 0도인 요소를 찾습니다.
        let zeroDegreeArticle = findZeroDegreeArticle(currentRotation);
        // 해당 요소의 이미지 src를 가져옵니다.
        let selectedImageSrc = zeroDegreeArticle.querySelector('img').src;
        // 해당 요소의 데이터를 가져옵니다.
        let category = zeroDegreeArticle.dataset.category;
        let type = zeroDegreeArticle.dataset.pftype;
        let title = zeroDegreeArticle.dataset.title;
        let link = zeroDegreeArticle.dataset.link;
        // .pf-view-img의 이미지 src 변경
        let pfViewImg = document.querySelector('.pf-view-img img');
        pfViewImg.src = selectedImageSrc;
        // .pf-view-sub의 내용 업데이트
        updateSubContent(category, type, title, link);
            
        articles.forEach(article => {
            article.style.opacity = 0.5;
            article.style.filter= 'blur(0.5px) brightness(0.6)';
        });

        // 현재 선택된 요소에 대해서만 스타일을 변경합니다.
        zeroDegreeArticle.style.opacity = 1;
        zeroDegreeArticle.style.filter= 'blur(0)';
    }

    // 하위 요소 업데이트 함수
    function updateSubContent(category, pftype, title, link) {
        let pfCategoryElement = document.querySelector('.pf-category');
        let pfTypeElement = document.querySelector('.pf-type');
        let pfTitleElement = document.querySelector('.pf-title');
        let aElement = document.querySelector('.pf-view-sub a');

        pfCategoryElement.textContent = category;
        pfTypeElement.textContent = pftype;
        pfTitleElement.textContent = title;
        aElement.href = link;

        if(category === "팀프로젝트") {
            pfCategoryElement.style.backgroundColor = '#111'
            pfCategoryElement.style.color = '#eee'
        } else if(category === "개인작업") {
            pfCategoryElement.style.backgroundColor = '#eee'
            pfCategoryElement.style.color = '#111'
        }
    }

    // 0도인 요소를 찾는 함수
    function findZeroDegreeArticle(currentRotation) {
        // 회전 각도가 0에 가장 가까운 요소를 찾습니다.
        let zeroDegreeArticle = articles[0];
        let minDiff = Math.abs(zeroDegreeArticle.dataset.rotationAngle - currentRotation);
        articles.forEach(article => {
            let diff = Math.abs(article.dataset.rotationAngle - currentRotation);
            if (diff < minDiff) {
                zeroDegreeArticle = article;
                minDiff = diff;
            }
        });
        return zeroDegreeArticle;
    }
}