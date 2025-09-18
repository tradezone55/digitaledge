

const CustomBack = ({ onGoBack }: { onGoBack: () => void }) => {
  return (
    <button
      className="fixed top-5 right-5 bg-white/10 border border-white/20 text-white px-5 py-3 rounded-lg cursor-pointer z-10 hover:bg-white/20"
      onClick={onGoBack}
    >
      Back
    </button>
  )
}

export default CustomBack