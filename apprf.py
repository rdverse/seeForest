# from flask import Flask

# app = Flask(__name__)

# @app.route("/6900")
# def hello():
#     return "Hello World"

# if __name__=='__main__':
#     app.run()

# import sklearn_json as skljson
from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, export_text
import tempfile
import matplotlib.pyplot as plt
import numpy as np
import pprint
from sklearn.preprocessing import MinMaxScaler


from sklearn.datasets import load_iris
from sklearn.tree import DecisionTreeClassifier, plot_tree

def export_dict(clf, feature_names=None):

    """Structure of rules in a fit decision tree classifier
    Parameters
    ----------
    clf : DecisionTreeClassifier
        A tree that has already been fit.
    features, labels : lists of str
        The names of the features and labels, respectively.
    """

    tree = clf.tree_
    if feature_names is None:
        feature_names = range(clf.max_features_)
    
    # Build tree nodes
    tree_nodes = []
    for i in range(tree.node_count):
        if (tree.children_left[i] == tree.children_right[i]):
            tree_nodes.append({"name":"leaf","feat":2, "val":0.1})
           #     clf.classes_[np.argmax(tree.value[i])]
        
        else:
            tree_nodes.append({
                "name": feature_names[tree.feature[i]],
                "val": 0.1,#tree.threshold[i],
                "feat":2,
                "left": tree.children_left[i],
                "right": tree.children_right[i],
            })
    
    #print(tree_nodes)
    # Link tree nodes
    for node in tree_nodes:
        #print(node)
        if node["name"]!="leaf":
            node["children"] = list()
            node["children"].append(tree_nodes[node["right"]])
            node["children"].append(tree_nodes[node["left"]])

    # for node in tree_nodes:
    #     print(node)
    #     if node["name"]!="leaf": 


    #print(tree_nodes[0])

    # Return root node
    return tree_nodes[0]

def export_links():
    # Need to write a function to export n links from each tree
    return True

def export_matrix():
    # Create a matrix that holds data and links
    return True



def add_children(instance):
    instance['children'] = [{"name" : "empty"},{"name": "empty"}]


'''

ruleSetState :   i) A list that tells where zeroes need to be added.
                ii) Set the list empty when passing to the function
               iii) The function will recursively add states to the list
                iv) State 1 : means an empty list needs to be added at that positiion. Ignore State 0
'''

def get_sub_slice(level=[], originalData={}, slice = {}, ruleSetState = []):

    if level:

        l = level.pop()

        # If condition if the slice is empty
        # This is for root node
        #print(ruleSetState)
        #print(slice)
        #print("level " + np.array2string(l))
        if not slice:
            if 'children' in originalData.keys(): 
                newSlice = originalData['children'][l]
                #Keep the previous rule here
                ruleSetState.append(0)
                #print("add 0 to rss at root")
            else:
                # Need to add a column of zeros in ruleSet
                ruleSetState.append(1)
                add_children(slice)
                #print("add 1 to rss at root")
        
        # slice is not empty
        # not root node
        else:
            if 'children' in slice.keys(): 
                newSlice = slice['children'][l]
                #Keep the previous rule here
                ruleSetState.append(0)
                #print("add 0 to rss at not root")
            else:
                add_children(slice)
                newSlice = slice['children'][l]
                 # Need to add a column of zeros in ruleSet
                ruleSetState.append(1)
                #print("add 1 to rss at not root")
                
        get_sub_slice(level=level, originalData=originalData, slice = newSlice, ruleSetState=ruleSetState)
        
    else:
        print("end of iteration")
        return ruleSetState




import itertools
data = load_iris()
from sklearn.ensemble import RandomForestClassifier
#clf = DecisionTreeClassifier(max_depth=2)
rf = RandomForestClassifier(n_estimators =20, max_depth=2)
rf.fit(data.data, data.target)



rfTrees = []
rfRules = []

for clf in rf.estimators_: 
    js = export_dict(clf,feature_names= data.feature_names)
    depth=3
    ruleSetState = []

    for i in range(1,depth):
        levels = np.array([ np.array(seq).astype(int) for seq in itertools.product("01", repeat=i)])
        #print(levels.shape)
        print("#"*30)

        for n,level in enumerate(levels):
            #print(n)
            level=list(level)
            get_sub_slice(level=level, originalData=js, slice={}, ruleSetState=ruleSetState)




    print(js)

    ruleMatrix = np.array(clf.tree_.decision_path(data.data.astype("float32")).todense()).astype("int")
    rm = ruleMatrix
    if js["children"][0]["children"][0]["name"]=="empty":
        print("Adding zeros at 2 and 3")
        ruleMatrix = np.insert(ruleMatrix, 5, np.zeros(150),axis=1)
        ruleMatrix = np.insert(ruleMatrix, 6, np.zeros(150),axis=1)
        
    if js["children"][1]["children"][0]["name"]=="empty":
        print("Adding zeros at 4 and 5")

        ruleMatrix = np.insert(ruleMatrix, 3, np.zeros(150),axis=1)
        ruleMatrix = np.insert(ruleMatrix, 4, np.zeros(150),axis=1)

    ruleJson = {}

    for i in range(1,7):
        ruleJson[i-1] = ruleMatrix[:,i].flatten().tolist()
        

    import json

    with open("ruleJson.json", "w") as jsData:
        jsonString = json.dumps(ruleJson)
        jsData.writelines(jsonString)
        
    rfTrees.append(js)
    rfRules.append(ruleJson)
    
    