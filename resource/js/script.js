// 전역변수
const dd = console.log;
const pad = v => v < 10 ? `0${v}` : v;
const ls = localStorage;
const ss = sessionStorage;

// 기본 객체
const App = {
    // 기본 실행
    init() {
        Introduce.init();
        Example.init();
        Goal.init();

        App.hook();
    },

    // 이벤트 핸들러
    hook() {
        $(document)
            .on("mousemove", "body", (e) => {
                $(".cursor").css({
                    "top": `${e.clientY}px`,
                    "left": `${e.clientX}px`
                });
            })
    }
}

// 언어 소개
const Introduce = {
    // 객체 전역변수
    time: 0,
    type: "",
    profile: true,

    // 기본 실행
    init() {
        Introduce.hook();
        Introduce.changeTab();
        Introduce.setIcon();
    },

    // 이벤트 핸들러
    hook() {
        $(document)
            .on("mouseover", ".introduce .cards .item", () => {
                clearInterval(Introduce.interval);
            })
            .on("mouseleave", ".introduce .cards .item", () => {
                Introduce.doSlide();
            })
            .on("mouseover", ".introduce .menu", () => {
                $(".introduce .menu .item").css("transform", "translateY(0)");
            })
            .on("mouseleave", ".introduce .menu", () => {
                $(".introduce .menu .item").css("transform", `translateY(${Introduce.type == "list" ? "-40px" : ""})`);
            })
            .on("click", ".introduce .menu .item", Introduce.changeTab)
            .on("click", ".introduce .toggleBtn", (e) => {
                Introduce.profile = !Introduce.profile;

                Introduce.changeTab();
            })
    },

    // 배경 아이콘
    setIcon() {
        Introduce.setIconInterval = setInterval(() => { 
            let left = Math.round(Math.random() * window.innerWidth);

            let size = Math.random() + 1;
            let rotate = (Math.random() * 60) - 30;
            
            let list = ['HTML', 'CSS', 'JS', 'PHP', 'SQL'];
            let text = list[Math.floor(Math.random() * list.length)];
            
            let color = ['33c8f377', '522d8f77', 'ffc20177', 'fe541777'][Math.round(Math.random() * 3)];
            let item = $(`<div class="back_icon" style="left : ${left}px; color: #${color}; font-size: ${size}rem; filter: blur(${3 - (size * 1.5)}px); transform: rotate(${rotate}deg); top: -5vh;">${text}</div>`);

            $('.introduce .box').append(item);

            item.animate({
                top : '100vh'
            }, 60000 - (size * 20000), 'linear', function() {
                this.remove();
            });
        }, 700);
    },

    // 탭 변경
    changeTab(e = false) {
        if (Introduce.profile) {
            $(".introduce .box .cards, .introduce .box .lists, .introduce .box .menu, .introduce .toProfile").css("display", "none");
            $(".introduce .box .profile").css("display", "flex");
        } else {
            $(".introduce .box .menu, .introduce .toProfile").css("display", "block");
            $(".introduce .box .profile").css("display", "none");

            let type = ls['introduceType'] ?? "card";

            if (e) type = $(e.currentTarget).data("idx");
            else $(".introduce .menu .item").css("transform", `translateY(${type == "list" ? "-40px" : ""})`);

            if (Introduce.type != type) {
                clearInterval(Introduce.interval);

                setTimeout(() => {
                    Introduce.doSlide();
                }, 500);
            }

            ls['introduceType'] = type;
            Introduce.type = type;

            $(".introduce .menu .item").removeClass("now");
            $(".introduce .box .cards, .introduce .box .lists").css("display", "none");

            if (type == "card") $(".introduce .menu .item").eq(0).addClass("now");
            else $(".introduce .menu .item").eq(1).addClass("now");

            if (Introduce.type == "card") $(".introduce .box .cards").css("display", "block");
            else $(".introduce .box .lists").css("display", "grid");
        }
    },

    // 카드 슬라이드
    doSlide() {
        clearInterval(Introduce.interval);

        if (Introduce.type != "card") return;

        Introduce.interval = setInterval(() => {
            Introduce.time += 1.5;

            if (Introduce.time >= 3600) Introduce.time = 0;

            $(".introduce .box .cards .slide").css({
                "transform": `rotateY(-${Introduce.time / 10}deg)`
            });
        }, 10);
    }
}

// 예시 디자인
const Example = {
    // 객체 전역변수
    now: "24지방",

    // 기본 실행
    init() {
        Example.hook();
        Example.setSelect();
        Example.setImage();
    },

    // 이벤트 핸들러
    hook() {
        $(document)
            .on("click", ".example .list_item", (e) => {
                Example.now = $(e.currentTarget).data("idx");

                $(`.example label`).removeClass("now");
                $(`.example label[data-idx="${Example.now}"]`).addClass("now");

                Example.setImage();
            })
    },

    // 셀렉트 박스 설정
    setSelect() {
        let list = ["24 지방", "24 경기", "24 광주", "25 지방", "25 경기", "25 전남", "25 충북"];

        $(".example .select").html(list.map((v, i) => {
            return `
                <label for="select" class="${i ? "" : "now"}" data-idx="${v.replaceAll(" ", "")}">${v}</label>
                ${i == list.length - 1 ? `<div class="list" style="${list.length}"></div>` : ""}
            `;
        }));

        $(".example .list").html(list.map(v => {
            return `<div class="list_item" data-idx="${v.replaceAll(" ", "")}">${v}</div>`
        }));
    },

    // 현재 이미지 설정
    setImage() {
        $(".example .img").html(`<img src="resource/img/designs/${Example.now}.png" alt="img" title="img">`);
    }
}

// 미래 목표
const Goal = {
    // 기본 실행
    init() {
        Goal.hook();
    },

    // 이벤트 핸들러
    hook() {
        $(document)
            .on("click", ".goal .img", (e) => {
                $(".goal .item").removeClass("now");
                $(".goal .item").eq($(e.currentTarget).data("idx") * 1).addClass("now");
            })
    }
}

// js 시작
$(() => {
    $.ajaxSetup({ cache: false });

    App.init();
});