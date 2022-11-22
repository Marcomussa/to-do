window.addEventListener("scroll", () => {

    const { scrollTop, clientHeight } = document.documentElement

    console.log(scrollTop, clientHeight)

    if(scrollTop == 500){
        console.log(true)
    }

})