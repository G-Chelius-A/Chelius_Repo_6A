export default function Dashboard({user, onLogout}){
    return(
        <>
            <h1>Dashboard</h1>
            <p>Bienvenido</p>
            <p>{user?.username}</p>
            <button onClick={onLogout}>
                Logout
            </button>
        </>
    );
}