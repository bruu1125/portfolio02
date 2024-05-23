// jquery
$(document).ready(function() {
    AOS.init({
        offset: 150,
        once: false,
        mirror: false,
        anchorPlacement: 'top-bottom'
    });

    function checkScroll() {
        if ($(window).scrollTop() > 200) {
            $(".index-header").addClass("header-scroll");
            $(".nav-btn span").addClass("nav-btn-scroll");
        } else {
            $(".index-header").removeClass("header-scroll");
            $(".nav-btn span").removeClass("nav-btn-scroll");
        }
    }
    $('.nav-btn').on('click', function(){
        $('.index-gnb').toggleClass('index-gnb-view');
    })
    
    // 페이지 로드 시 스크롤 위치 체크
    $(window).on('load', checkScroll);

    // 스크롤 시 스크롤 위치 체크
    $(document).on('scroll', function() {
        checkScroll();

        // 스크롤 위치가 두 번째 섹션(즉, 1 페이지 높이)을 지났는지 확인
        if ($(window).scrollTop() > window.innerHeight / 2) {
            $(".topBtn").addClass("topBtn-active");
        } else {
            $(".topBtn").removeClass("topBtn-active");
        }
    });
    let rotationAngle = 0;

    $("#aniPrevBtn").on('click', function(){
        rotationAngle -= 60;
        $(".pf-inner-web").css('transform', `rotateX(${rotationAngle}deg)`);
    });

    $("#aniNextBtn").on('click', function(){
        rotationAngle += 60; // 각도 60도 증가
        $(".pf-inner-web").css('transform', `rotateX(${rotationAngle}deg)`); // 회전 적용
    });
    $("input[type=radio]").each(function(){ 
        var chk = $(this).is(":checked");
        var name = $(this).attr('name');
        if(chk == true) 
        $("input[name='"+name+"']").data("previous",$(this).val());
    });

    $("input[type=radio]").click(function(){
        var pre = $(this).data("previous");
        var chk = $(this).is(":checked");
        var name = $(this).attr('name');
        if(chk == true && pre == $(this).val()){
            $(this).prop('checked',false);
            $("input[name='"+name+"']").data("previous",'');
        } else {if(chk == true) 
            $("input[name='"+name+"']").data("previous",$(this).val());
        }
    });

    let page = 1;
    const totalPages = 6;

    function scrollToPage(pageNumber) {
        let posTop = (pageNumber - 1) * window.innerHeight;
        window.scrollTo({
            top: posTop,
            behavior: 'smooth'
        });
    }

    // 페이지 로드 시 현재 페이지 위치로 스크롤
    scrollToPage(page);

    // 네비게이션 버튼 클릭 이벤트 리스너
    $(".index-gnb li").on('click', function(){
        // 클릭된 버튼의 인덱스를 기반으로 페이지 업데이트
        page = $(this).index() + 2; // 1부터 시작하므로 1을 더하고, 0부터 시작하므로 1을 추가
        // 페이지가 범위를 벗어나는지 확인하고 업데이트
        page = Math.max(1, Math.min(page, totalPages));
        // 새로운 페이지로 스크롤
        scrollToPage(page);
    });
    $(".scroll-icon").on('click', function() {
        if (page === 1) {
            page++;
            scrollToPage(page);
        }
    });
    $(".topBtn").on('click', function() {
        page = 1;
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 스크롤 이벤트 리스너 추가
    let isScrolling = false;

    window.addEventListener("wheel", function(e) {
        e.preventDefault();
        
        // 스크롤할때 한페이지씩만 이동하도록
        if (isScrolling) return;

        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
        }, 500); // 스크롤 잠금 시간 (1초)

        if (e.deltaY > 0) {
            page = Math.min(page + 1, totalPages);
        } else if (e.deltaY < 0) {
            page = Math.max(page - 1, 1);
        }

        scrollToPage(page);
    }, { passive: false });    
});

// vanila js
document.addEventListener("DOMContentLoaded", function() {
    let rotationAngle = 0;
    let articles = document.querySelectorAll('.pf-inner-web > article');
    let totalArticles = articles.length;
    let rotationAngleIncrement = 360 / totalArticles;
    let currentArticleIndex = 0; 

    updateViewedImage();
        

    // article 요소들을 회전시킵니다.
    articles.forEach((article, index) => {
        let rotationAngle = index * rotationAngleIncrement;
        article.style.transform = `rotateX(${-rotationAngle}deg) translateZ(35vh)`;
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

    const contactBox = document.querySelector('.contact'); // 해당 섹션 선택
    const contactList = contactBox.querySelectorAll('.contact-list');
    const closeButtons = contactBox.querySelectorAll('.contact-close');
    const contactItems = contactBox.querySelectorAll('.contact-list-slide');

    // 모든 contactItem의 스타일을 초기화하는 함수
    function resetContactItems() {
        contactItems.forEach(contactItem => {
            contactItem.style.transform = 'translateY(0)'; // 초기 상태로 설정
        });
    }

    // contactList 항목 클릭 이벤트 리스너 추가
    contactList.forEach((list, index) => {
        list.addEventListener('click', (event) => {
            // 클릭 이벤트가 발생했을 때 이벤트 전파를 막음
            event.stopPropagation();
            // 모든 contactItem의 스타일을 초기화
            resetContactItems();
            // 클릭된 contactItem의 스타일을 변경
            contactItems[index].style.transform = 'translateY(-50%)';
            // 클릭된 contactList의 높이를 변경
            // list.style.height = '30vh'; // 높이를 35vh로 설정
            // 클릭된 요소 내에서 .contact-list-icon 및 .contact-list-hidden 선택
            const clickedIcon = list.querySelector('.contact-list-icon');
            const clickedHidden = list.querySelector('.contact-list-hidden');
            // 클릭된 요소의 .contact-list-icon 및 .contact-list-hidden의 투명도 조절
            clickedIcon.style.opacity = 0;
            clickedHidden.style.opacity = 1;
            // 다른 .contact-list-icon과 .contact-list-hidden의 투명도 원래대로 되돌리기
            contactList.forEach((otherList, otherIndex) => {
                if (otherIndex !== index) {
                    otherList.querySelector('.contact-list-icon').style.opacity = 1;
                    otherList.querySelector('.contact-list-hidden').style.opacity = 0;
                }
            });
        });
    });
    // 닫기 버튼 클릭 이벤트 리스너 추가
    closeButtons.forEach((button) => {
        button.addEventListener('click', (event) => {
            // 클릭 이벤트가 발생했을 때 이벤트 전파를 막음
            event.stopPropagation();
            // 모든 contactItem의 스타일을 초기화
            resetContactItems();
            // resetContactLists()
            // 모든 contactList의 높이를 원래대로 변경
            contactList.forEach((otherList, otherIndex) => {
                otherList.querySelector('.contact-list-icon').style.opacity = 1;
                otherList.querySelector('.contact-list-hidden').style.opacity = 0;
            });
        });
    });
    // 섹션 내에서 클릭 이벤트 리스너 추가
    contactBox.addEventListener('click', (event) => {
    // 클릭된 요소가 contactList 항목이 아닌 경우에만 resetContactItems 호출
        if (!event.target.closest('.contact-list')) {
            resetContactItems();
            contactList.forEach((otherList, otherIndex) => {
                otherList.querySelector('.contact-list-icon').style.opacity = 1;
                otherList.querySelector('.contact-list-hidden').style.opacity = 0;
            });
        }
    });
    
    // contact섹션 메일주소 복사
    function copy() {
        const eMail = document.getElementById("mailAd").textContent;
        // 일시적인 텍스트 영역 생성
        const tempInput = document.createElement("textarea");
        tempInput.value = eMail;
        document.body.appendChild(tempInput);
        // 텍스트 영역 선택
        tempInput.select();
        tempInput.setSelectionRange(0, 99999); // Mobile 대응
        // 텍스트 복사
        document.execCommand("copy");
        // 텍스트 영역 제거
        document.body.removeChild(tempInput);
        // 복사 완료 알림
        alert("복사되었습니다.");
    }

    document.getElementById("copyBtn").addEventListener("click", copy);

    // 이력서 열람 모달창
    const modal = document.querySelector('.resume-box');
    const modalOpen = document.querySelector('.resume-open');
    const modalClose = document.querySelector('#modalClose');

    modalOpen.addEventListener('click', function(){
        modal.classList.add('resumeon');
    });
    modalClose.addEventListener('click', function(){
        modal.classList.remove('resumeon');
    });
    modal.addEventListener('click', function(e){
        if(e.target == modal){
            modal.classList.remove('resumeon');
        }
    });

    // 푸터 연도 업데이트
    let dateYear = new Date().getFullYear();
    document.querySelector('.f-year').innerText = dateYear;
}); 