export const SideClickThreeButton = ()=>{
    return (
      <>
        <div className='w-1/20 h-1/11 absolute rounded-2xl top-0 left-0 cursor-pointer 
                ml-1' onClick={()=>{handlePopUpFunction(-1)}}> ✕ </div>
        <div className='absolute top-0 right-1'>
            <button className='tracking-tight bg-blue-300 text-white px-4 py-1
                rounded-md hover:bg-blue-500 transition' onClick={()=>fetchPdf(numberToShow)}>
                   export
            </button>
        </div>
      </>
    )
}