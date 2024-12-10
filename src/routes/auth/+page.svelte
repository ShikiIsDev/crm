<form method="POST" action="?/login">
    <h1>Login</h1>
    <label>
      <div class="label">
        Email:
      </div>
      <input name="email" type="email" />
    </label>
    <label>
        <div class="label">
            Password:
        </div>
      <input name="password" type="password" />
    </label>
    <button type="submit">Login</button>
  </form>


<style lang="scss">
    form {
        font-family: 'Poppins';
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center; 
        padding: 1.5rem;
        border: 2px solid #e0e0e0;
        border-radius: 10px;
        max-width: 500px;
        margin:auto;

        button {
            width: fit-content;
            background-color: #007bff;
            color: white;
            border: 0px;
            border-radius: 2px;
            padding: 0.5rem;
        }

        label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            
            
            .label {
                width: 80px;
            }

            input {
                border-radius: 2px;
                border: 1px solid #b9d9df;
            }
 
        }
    }
</style>