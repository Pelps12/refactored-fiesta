import bodyStyles from "../styles/Body.module.css"
import {useRouter} from "next/router"
import {useEffect, useState} from "react"
import useSWRInfinite from "swr/infinite"
import {stringify} from "query-string"
import {useSession} from "next-auth/react"
import Listing from "./Listing"

const fetcher = (url) => fetch(url).then((res) => res.json());
const PAGE_SIZE = 6;

const Body = ({session}) => {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")
    const [product, setProduct] = useState("")
    
    
    useEffect(()=>{
        console.log("Fuck you");
    }, [session])


    useEffect(() =>{
        console.log(router.query);
        if(router.query.product !== undefined || router.query.area !== undefined){
            console.log("object");
            setQuery(stringify(router.query))
            mutate()
        }
        
    }, [router.query])

    
    
    const {data, error, mutate, size, setSize, isValidating} = useSWRInfinite(
        (index) =>
            `http://localhost:3000/api/listing?${query}&per_page=${PAGE_SIZE}&page=${index+1}`, fetcher
    )
    console.log(query);
    const listings = data ? [].concat(...data) : []
    console.log(data);
    const isLoadingInitialData = !data && !error
    const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === "undefined");
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
    const isRefreshing = isValidating && data && data.length === size;
    
    
    
    
    //When user clicks Search
    const updateQuery = (e) =>{
        e.preventDefault()
        if(location === "" && product !== ""){
            router.push(`?product=${product}`, undefined, {shallow: true})
        }
        else if(location !== "" && product === ""){
            router.push(`?area=${location}`, undefined, {shallow: true})
        }
        else if(location !== "" && product !== ""){
            router.push(`?area=${location}&product=${product}`, undefined, {shallow: true})
        }
        
    }
    return (
        <div className="sm:m-auto sm:grid md:ml-0 md:grid-cols-4">
            <div className="m-4 max-w-md col-span-1">
                <form className={bodyStyles}>
                   <div className="body-form">
                   <label className="p-2" htmlFor="location">Location</label>
                    <select className="form-select 
                                        block
                                        w-full
                                        px-3
                                        py-1.5
                                        text-base
                                        font-normal
                                        text-gray-700
                                        bg-white bg-clip-padding bg-no-repeat
                                        border border-solid border-gray-300
                                        rounded
                                        transition
                                        ease-in-out
                                        m-0
                                        focus:text-gray-700 
                                        focus:bg-white focus:border-blue-600 
                                        focus:outline-none"
                            value={location}
                            placeholder="Choose Location" 
                            onChange={(e) => setLocation(e.target.value=== "Select an Option" ? "": e.target.value)} 
                            name="location" 
                            id={bodyStyles.location}>
                        <option defaultValue="none">Select an Option</option>
                        <option value="ikotun">Ikotun</option>
                        <option value="Lekki">Lekki</option>
                        <option value="Akoka">Akoka</option>
                    </select>
                   </div>
                    <div className="body-form">
                    <label className="p-2" htmlFor="product">Product</label>
                    <select 
                            className="form-select 
                            block
                            w-full
                            px-3
                            py-1.5
                            text-base
                            font-normal
                            text-gray-700
                            bg-white bg-clip-padding bg-no-repeat
                            border border-solid border-gray-300
                            rounded
                            transition
                            ease-in-out
                            m-0
                            focus:text-gray-700 
                            focus:bg-white focus:border-blue-600 
                            focus:outline-none"
                            value={product}
                            placeholder="Choose Location" 
                            onChange={(e) => setProduct(e.target.value=== "Select an Option" ? "": e.target.value)}
                            name="product" 
                            id={bodyStyles.product}>
                        <option defaultValue="none">Select an Option</option>
                        <option value="pepper">Pepper</option>
                        <option value="Tomatoes">Tomatoes</option>
                        <option value="maggi">Maggi</option>
                    </select>
                    </div>
                    <button className="rounded-md justify-center px-3 py-2 block m-4 bg-orange-500" onClick={updateQuery} type="submit">SEARCH</button>
                </form>
                <p>
                    showing {size} page(s) of {isLoadingMore ? "..." : listings.length}{" "}
                    listing(s){" "}
                    <div className="grid grid-cols-3 max-w-md">
                        <button
                        className="rounded-md justify-center px-3 py-2 block m-4 bg-slate-200"
                        disabled={isLoadingMore || isReachingEnd}
                        onClick={() => setSize(size + 1)}
                        >
                        {isLoadingMore
                            ? "loading..."
                            : isReachingEnd
                            ? "no more listings"
                            : "load more"}
                        </button>
                        <button className="rounded-md justify-center px-3 py-2 block m-4 bg-slate-200" disabled={isRefreshing} onClick={() => mutate()}>
                        {isRefreshing ? "refreshing..." : "refresh"}
                        </button>
                        <button className="rounded-md justify-center px-3 py-2 block m-4 bg-slate-200"disabled={!size} onClick={() => setSize(0)}>
                        clear
                        </button>
                    </div>
                    
                </p>
                {isEmpty ? <p>No listings available</p> : null}
            </div>
            <div className="grid grid-cols-3 col-span-3">
                {listings.map((listing) =>{
                    return(
                        <div key={listing._id}>
                            <Listing listing={listing}/>
                        </div>
                    )
                    
                })}
            </div>
        </div>
    )
}
export default Body