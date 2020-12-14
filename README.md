Сервис заметок

Запросы
-

@POST /api/users - Регистрация
    
    BODY
    {
        login: "Логин",
        password: "Пароль"
    }
    @RETURN {
        token: xxx 
    }

---------------

@GET /api/auth - Получить авторизованного пользователя
    
    HEADERS: x-auth-token: Наш токен
    @RETURN {
        id: 1
        ...
    } объект пользователя

---------------

@POST /api/auth - Авторизация
    
    {
        login: "Логин",
        password: "Пароль"
    }
    @RETURN {
        token: xxxx
    }
   
---------------

@GET /api/notes - Все заметки авторизованного пользователя
    
    HEADERS x-auth-token: Наш токен
    QUERY PARAMS
    {
        limit: 10, (по умолчанию 10)
        offset: 0 (по умолчанию 0)
    }
    @RETURN {
        totalCount: 10 // Общее колч для пагинации
        notes: [] // Массив заметок
    }
   
---------------
@POST /api/notes - Создать заметку
    
    HEADERS x-auth-token: Наш токен
    BODY
    { 
        text: "Текст заметки"
        isPublic: false (Публичная заметка? По умолчанию false)
    }
    @RETURN {
        id: xxxx
        ...
    } - Объект заметки
   
---------------
@PUT /api/notes/:id - Редактировать заметку
    
    HEADERS x-auth-token: Наш токен
    BODY
    { 
        text: "Текст заметки"
        isPublic: false (Публичная заметка? По умолчанию false)
    }
    @RETURN {
        id: xxxx
        ...
    } - Объект заметки
   
---------------
@DELETE /api/notes/:id - Удалить заметку
    
    HEADERS x-auth-token: Наш токен
    @RETURN 
   
---------------
@GET /api/notes/public/:id - Получить публичную заметку
    
    HEADERS x-auth-token: Наш токен
    @RETURN {
        id: xxxx
        ...
    } - Объект заметки
   
---------------

@POST /api/auth/terminate/all - Сброс всех текущих сессий
    
    HEADERS x-auth-token: Наш токен
    @RETURN 
   
---------------

