import bahttext
import datetime

def handleNone(s:str) :
    return s if s != None else "-"

def showInt(x) :
    try :
        if int(x) == x :
            return f"{x:,.0f}"
        return f"{x:,}"
    except :
        return "INVALID"