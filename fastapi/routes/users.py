from fastapi import APIRouter, HTTPException, status, Depends
from typing import Optional
import logging

from queries.users import *
from models.users import *

from auth.auth import verify_password, create_access_token, get_current_user

router = APIRouter(tags=["Users"])
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(" USERS ROUTE ")


# Sign-up endpoint
@router.post("/register", response_model=UserOut)
async def signup_route(user: UserCreate):
    logger.info("Signing up a new user")
    response = await add_user(user.username, user.email, user.password)
    if "error" in response:
        logger.warning(response["error"])
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail=response["error"]
        )
    return UserOut(**response)


# Sign-in endpoint
@router.post("/signin")
async def signin_route(user: UserLogin):
    logger.info("Signing in...")
    user_data = await get_user_by_username(user.username)
    if not user_data:
        logger.warning("User not found")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )
    if not verify_password(user.password, user_data["password"]):
        logger.warning("Invalid credentials")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    access_token = create_access_token(
        data={"sub": str(user_data["id"])}, remember_me=user.remember_me
    )
    logger.info(f"Login successful for {user_data['id']}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "username": user_data["username"],
    }

    # if user_data and verify_password(user.password, user_data["password"]):
    #     access_token = create_access_token(data={"sub": str(user_data["id"])}, remember_me=user.remember_me)
    #     logger.info(f"Login successful for {user_data['id']}")
    #     return {"access_token": access_token, "token_type": "bearer"}
    # logger.warning("Invalid credentials")
    # raise HTTPException(status_code=401, detail="Invalid credentials")


# Delete user endpoint
@router.delete("/delete_account", response_model=UserOut)
async def delete_user_route(current_user: str = Depends(get_current_user)):
    logger.info(f"Deleting user {current_user}")
    deleted_user = await delete_user(int(current_user))
    if not deleted_user:
        logger.warning("Failed to delete user or user not found")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete user or user not found",
        )
    return UserOut(**deleted_user)
