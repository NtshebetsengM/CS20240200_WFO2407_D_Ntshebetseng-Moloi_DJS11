import { useState, useEffect, useRef } from "react";

export function useFavourites(){
    const [ favourites, setFavourites ] = useState<string[]>([])
    const isInitialRender = useRef(true)

    useEffect(()=>{
        const savedFavourites = JSON.parse(localStorage.getItem('favourites') || '[]')
        setFavourites(savedFavourites)
    },[])

    useEffect(()=>{
        if(isInitialRender.current){
            isInitialRender.current = false
            return
        }
        localStorage.setItem('favourites',JSON.stringify(favourites))
    },[favourites])
    return [ favourites, setFavourites ] as const
}