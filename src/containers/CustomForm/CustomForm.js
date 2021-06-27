import { useForm } from '../../functions/customHooks.js';

const CustomForm = ({ formName, formFields, onFormSubmit, isLoading }) => {

    const { inputs, handleInputChange, handleSubmit } = useForm(() => onFormSubmit(formFields, inputs));

    return (
        <article className="br3 ba b--black-10 mv4 shadow-5 center" style={{maxWidth: '20rem'}}>
            <form className="pa4 black-80" style={{position: 'relative'}}>
                <div className="measure">
                    <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
                        <legend className="f1 fw6 ph0 mh0">
                            {formName}
                        </legend>
                        {
                            formFields.map(field => (
                                <div className="mt3" key={field.name}>
                                    <label className="db fw6 lh-copy f6" htmlFor={field.name} style={{textTransform: 'capitalize'}}>
                                        {field.name}
                                    </label>
                                    <input 
                                        className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                                        type={field.type}
                                        name={field.name}
                                        id={field.name} 
                                        autoComplete={field.name}
                                        onChange={handleInputChange}
                                    />
                                </div>
                        ))}
                    </fieldset>
                    <div className="" style={{paddingTop: '10px'}}>
                        <input
                            onClick={handleSubmit}
                            className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                            type="submit"
                            value={!isLoading ? formName : 'Please wait...'}
                            />
                    </div>
                    {/* <div className="lh-copy mt3">
                        <p
                            onClick={() => changeToRoute('SignIn')}
                            className="f6 link dim black db pointer">
                                ...or Sign In
                        </p>
                    </div> */}
                </div>
            </form>
        </article>
    );
}

export default CustomForm;


/*
El argumento formFields tiene que ser un array de objetos del tipo 
  { 
      name: 'nombre del campo',
      type: 'tipo de campo'
  }
*/