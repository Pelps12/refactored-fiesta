import {useEffect, useState} from "react"
import { Widget, WidgetAPI } from "@uploadcare/react-widget";

const Test = () => {
  const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
  const [image, setImage] = useState(null)

  const changeHandler = (event) => {
    console.log(event.target.files[0]);
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);

    if (event.target.files && event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
    }
    
    
	};
  useEffect(()=>{
    console.log(image);
  }, [image])

  const handleSubmission = async () =>{
    const formData = new FormData();
    console.log(selectedFile);
    formData.append("UPLOADCARE_PUB_KEY", process.env.NEXT_PUBLIC_UPLOADCARE_PUB_KEY)
    formData.append("UPLOADCARE_STORE", "auto")
    formData.append(`my_file.jpg`, selectedFile, selectedFile.name)
    

    const response = await fetch("https://upload.uploadcare.com/base/", {
      method: "POST",
      body: formData
    })
    if(response.ok){
      console.log(response);
      const result = await response.json()
      console.log(result);
    }
    else{
      console.log(response)
    }
  }
    
    return(
      <div>
			<input type="file"  onChange={changeHandler} className="filetype"/>
			{isFilePicked ? (
				<div>
					<p>Filename: {selectedFile.name}</p>

				</div>
			) : (
				<p>Select a file to show details</p>
        
			)}
      <div>
        <img className="object-scale-down max-w-sm max-h-sm rounded-lg" src={image}/>
      </div>
      
			<div>
				<button className="bg-orange-500 px-4 py-3 my-4 rounded-md" onClick={handleSubmission}>Submit</button>
			</div>
		</div>
    )
}

const getLength =(formData) =>{
  let length = 0;
  formData.forEach((data) =>{
    console.log(data);
    if(typeof data === "string"){
      length += data.length
    }
    else{
      length += data.size
    }
  })
  return length;
}
 
export default Test;