let mainSectionImg_2 = document.querySelector(".mainSectionImg_2")
let mainSectionImg_3 = document.querySelector(".mainSectionImg_3")

window.addEventListener("scroll", () => {

    const { scrollTop, clientHeight } = document.documentElement

    console.log(Math.trunc(scrollTop), clientHeight)
    
})