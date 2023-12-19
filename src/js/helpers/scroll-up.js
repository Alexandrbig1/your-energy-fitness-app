export default function scrollUpToSection(sectionClassOrIDName){
    document.querySelector(sectionClassOrIDName).scrollIntoView({ behavior: "smooth" });
}