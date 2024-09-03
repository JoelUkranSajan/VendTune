const BasicTextEntry = (props) => {
  return (
    <div>
      <input
        className='BasicTextEntry'
        type={props.type}
        placeholder={props.placeholder}
      />
    </div>
  );
};

export default BasicTextEntry;
