let mainSectionImg_2 = document.querySelector(".mainSectionImg_2")
let mainSectionImg_3 = document.querySelector(".mainSectionImg_3")

window.addEventListener("scroll", () => {

    const { scrollTop, clientHeight } = document.documentElement

    console.log(scrollTop, clientHeight)

    for(let i = 600; i <= 660; i++){
        if(Math == i){
            console.log(mainSectionImg_3)
            mainSectionImg_3.classList.add("animate__backInRight")
        }
    }

    for(let i = 185; i <= 230; i++){
        if(scrollTop == i){
            console.log(mainSectionImg_2)
            mainSectionImg_2.classList.add("animate__backInLeft")
        }
    }
})