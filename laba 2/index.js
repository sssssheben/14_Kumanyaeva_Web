document.addEventListener("DOMContentLoaded", () => {
    const themeBtn = document.getElementById("theme-btn");
    
    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
        
        if (document.body.classList.contains("dark-mode")) {
            themeBtn.textContent = "ЧОРТ КАК ЖЕ ТЕМНО ☀️";
        } else {
            themeBtn.textContent = "ААААА ЧОРТ КАК СВЕТЛО ВЫКЛЮЧИТЕ ЭТО 🌙";
        }
    });


    const reviewsData = [
        { name: "Макар, 10 лет", text: "Всё идеально, как и заявлял продавец. Мусор ⭐️⭐️⭐️⭐️⭐️", img: "" },
        { name: "Лев, 42 года", text: "Говно еб*ное. 10/10", img: "" },
        { name: "Владислав, 53 года", text: "падарил жине на васмое марта. ана меня бросела. спосибо.", img: "" }
    ];

    const reviewsContainer = document.getElementById("reviews-container");
    const reviewForm = document.getElementById("review-form");
    const nameInput = document.getElementById("rev-name");
    const textInput = document.getElementById("rev-text");
    const imgInput = document.getElementById("rev-img");

    function renderReviews() {
        reviewsContainer.innerHTML = "";
        
        reviewsData.forEach(review => {
            const div = document.createElement("div");
            div.className = "review";

            const imgHTML = review.img ? `<img src="${review.img}" alt="Фото к отзыву" class="review-img">` : "";
            
            div.innerHTML = `
                <strong>${review.name}:</strong> 
                <p>"${review.text}"</p>
                ${imgHTML}
            `;
            reviewsContainer.appendChild(div);
        });
    }


    reviewForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const nameValue = nameInput.value.trim();
        const textValue = textInput.value.trim();
        const imgValue = imgInput.value.trim();

        if (nameValue.length < 2) {
            alert("эм у че за имя дурацкое, давай еще букв навали");
            return;
        }

        if (textValue.length < 5) {
            alert("неискренне бро, меньше 5 буков не принимаю.");
            return;
        }

        reviewsData.unshift({
            name: nameValue,
            text: textValue,
            img: imgValue
        });

        renderReviews();
        reviewForm.reset();
    });

    renderReviews();


    const gameBtn = document.getElementById("game-btn");

    gameBtn.addEventListener("click", () => {
        const wantsToPlay = confirm("ты готов пошариться по мусоркам и возможно обрести несметное богатство?");
        
        if (!wantsToPlay) {
            alert("пахнешь слабостью дружище");
            return;
        }

        let choice1 = "";
        while (true) {
            choice1 = prompt("перед тобой три мусорных бака:\n1 - из рыжего леса(радиоактивный)\n2 - из студгородка(пахнет...помойкой)\n3 - элитный(рядом с каким-то крутым жк на мяусах)\n\nкуда полезешь? (введи 1, 2 или 3)");

            if (choice1 === null) {
                alert("слабость. конец игры.");
                return;
            }

            if (choice1 === "1" || choice1 === "2" || choice1 === "3") {
                break;
            } else {
                alert("ты слепой написано же только 1 2 или 3, попробуй еще раз");
            }
        }


        if (choice1 === "1") {
            alert("ты нашел кусок урания, но у тебя отвалились ручки и выпали волосы... ГЕЙМ ОВА");
            return;
        } 
        else if (choice1 === "3") {
            alert("ты нашел вонючий айкос и задохнулся... ГЕЙМ ОВА");
            return;
        }
        else if (choice1 === "2") {
            const eat = confirm("а ты не из слабаков... в помойке лежал какой-то китайский пирожок, приготовленный вьетнамцем из креста. попробуешь?");
            
            if (eat) {
                alert("пирожок оказался с сюрпризом (внутри было мясо голубя котрого вьетнамец поймал в далеком 2007 году в хошимине и привез с собой в мск...). ты отравился. ГЕЙМ ОВА");
                return;
            } else {
                alert("ну и правильно, от вьетнамской еды появляются гастритные язвы. ты просто забрал 100 рублей которые лежали рядом и пошел в тушинский комплекс.");
                
                let choice2 = "";
                while(true) {
                    choice2 = prompt("у тебя есть 100 рублей. а рядом с тушкой так много всего, что выберешь:\n1 - купить ОЧ ПОДОЗРИТЕЛЬНУЮ ШАУРМУ на углу у трамвайной остановки\n2 - купить золотой флеш в пятерке\n\n(введи 1 или 2)");
                    
                    if (choice2 === null) {
                        alert("эти 100 рублей у тебя вырвал из рук оголодавший магистр, конец.");
                        return;
                    }
                    if (choice2 === "1" || choice2 === "2") {
                        break;
                    }
                    alert("ты слепой введи 1 или 2");
                }

                if (choice2 === "1") {
                    alert("эта шаурма оказалась не так плоха, и пока ты её ел... задумался о жизни, о том, что ты делаешь не так..... отчислился из рхту и ушел работать в табачку рядом с вузом! ПОБЕДА!!!");
                } else {
                    alert("последние свои минуты жизни до того, как у тебя кольнуло в сердце ты наслаждался этим прекрасным чудесным невероятным богоподобным вкусом флеша... из минусов ты умер. ГЕЙМ ОВА");
                }
            }
        }
    });
});